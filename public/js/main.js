/* Agniveer Defence Academy — interactions */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close menu when a link is tapped
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Scroll reveal ---- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealTargets = document.querySelectorAll(
    ".about-grid, .program-card, .feature, .director-grid, .gallery-grid img, .contact-grid, .free-item"
  );

  function revealAll() { revealTargets.forEach(function (el) { el.classList.add("reveal", "visible"); }); }

  if (reduceMotion) {
    revealAll();
  } else {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });
    // Failsafe: never leave content hidden if the observer doesn't fire.
    setTimeout(revealAll, 2500);
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else if (!reduceMotion) {
    revealAll();
  }

  /* ---- Enquiry form (opens WhatsApp with the message) ---- */
  var form = document.getElementById("enquiryForm");
  var note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var branch = form.branch.value;
      var message = form.message.value.trim();

      if (!name || !phone) {
        setNote("Please enter your name and phone number.", "err");
        return;
      }
      if (!/^[0-9+\-\s]{7,15}$/.test(phone)) {
        setNote("Please enter a valid phone number.", "err");
        return;
      }

      var text =
        "Hello Agniveer Defence Academy!%0A" +
        "Name: " + encodeURIComponent(name) + "%0A" +
        "Phone: " + encodeURIComponent(phone) + "%0A" +
        "Interested in: " + encodeURIComponent(branch) +
        (message ? "%0AMessage: " + encodeURIComponent(message) : "");

      var waUrl = "https://wa.me/919010575723?text=" + text;
      setNote("Opening WhatsApp to send your enquiry…", "ok");
      window.open(waUrl, "_blank");
      form.reset();
    });
  }

  function setNote(msg, type) {
    if (!note) return;
    note.textContent = msg;
    note.className = "form-note " + type;
  }

  /* ---- Latest photos (uploaded by coaches via /admin.html) ---- */
  (function loadLatestPhotos() {
    var section = document.getElementById("updates");
    var grid = document.getElementById("latestGrid");
    if (!section || !grid) return;
    fetch("/api/photos")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.photos || !data.photos.length) return;
        data.photos.slice(0, 12).forEach(function (p) {
          var img = document.createElement("img");
          img.src = "/photo/" + encodeURIComponent(p.key);
          img.alt = p.caption || "Agniveer Defence Academy photo";
          img.loading = "lazy";
          grid.appendChild(img);
        });
        section.hidden = false;
      })
      .catch(function () { /* API not available (e.g. static preview) — leave hidden */ });
  })();
})();
