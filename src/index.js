/**
 * Agniveer Defence Academy — Worker
 * Serves the static site (via the ASSETS binding) and provides a tiny photo API
 * so coaches can upload photos daily from a phone. Photos are stored in KV.
 *
 * Bindings expected (set in wrangler.jsonc / dashboard):
 *   ASSETS       — static assets (public/)
 *   PHOTOS_KV    — KV namespace for uploaded photos   (optional until configured)
 *   ADMIN_PASSWORD — secret; the upload password       (optional until configured)
 */

const PREFIX = "photo:";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB per photo

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === "/api/photos" && request.method === "GET") return listPhotos(env);
      if (path === "/api/upload" && request.method === "POST") return uploadPhoto(request, env);
      if (path.startsWith("/api/photos/") && request.method === "DELETE") {
        return deletePhoto(decodeURIComponent(path.slice("/api/photos/".length)), request, env);
      }
      if (path.startsWith("/photo/") && request.method === "GET") {
        return servePhoto(decodeURIComponent(path.slice("/photo/".length)), env);
      }
    } catch (err) {
      return json({ error: "Server error: " + (err && err.message) }, 500);
    }

    // Everything else → the static website.
    return env.ASSETS.fetch(request);
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function checkPassword(supplied, env) {
  return !!env.ADMIN_PASSWORD && supplied === env.ADMIN_PASSWORD;
}

async function listPhotos(env) {
  if (!env.PHOTOS_KV) return json({ photos: [], configured: false });
  const list = await env.PHOTOS_KV.list({ prefix: PREFIX, limit: 1000 });
  const photos = list.keys
    .map((k) => ({
      key: k.name.slice(PREFIX.length),
      caption: (k.metadata && k.metadata.caption) || "",
      uploadedAt: (k.metadata && k.metadata.uploadedAt) || 0,
    }))
    .sort((a, b) => b.uploadedAt - a.uploadedAt);
  return json({ photos, configured: true });
}

async function uploadPhoto(request, env) {
  if (!env.PHOTOS_KV) return json({ error: "Photo storage is not set up yet." }, 503);

  const form = await request.formData();
  if (!checkPassword(form.get("password"), env)) return json({ error: "Wrong password." }, 401);

  const file = form.get("photo");
  if (!file || typeof file === "string") return json({ error: "Please choose a photo." }, 400);

  const type = file.type || "image/jpeg";
  if (!type.startsWith("image/")) return json({ error: "Only image files are allowed." }, 400);

  const buf = await file.arrayBuffer();
  if (buf.byteLength > MAX_BYTES) return json({ error: "Image is too large (max 8 MB)." }, 400);

  const caption = String(form.get("caption") || "").slice(0, 200);
  const uploadedAt = Date.now();
  const ext = (type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const id = uploadedAt + "-" + Math.random().toString(36).slice(2, 8) + "." + ext;

  await env.PHOTOS_KV.put(PREFIX + id, buf, {
    metadata: { caption, uploadedAt, contentType: type },
  });
  return json({ ok: true, key: id });
}

async function deletePhoto(key, request, env) {
  if (!env.PHOTOS_KV) return json({ error: "Photo storage is not set up yet." }, 503);
  if (!checkPassword(request.headers.get("x-admin-password"), env)) {
    return json({ error: "Wrong password." }, 401);
  }
  await env.PHOTOS_KV.delete(PREFIX + key);
  return json({ ok: true });
}

async function servePhoto(key, env) {
  if (!env.PHOTOS_KV) return new Response("Not found", { status: 404 });
  const { value, metadata } = await env.PHOTOS_KV.getWithMetadata(PREFIX + key, { type: "arrayBuffer" });
  if (!value) return new Response("Not found", { status: 404 });
  return new Response(value, {
    headers: {
      "Content-Type": (metadata && metadata.contentType) || "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
