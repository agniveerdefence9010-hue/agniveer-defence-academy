# Agniveer Defence Academy — Website

Official website for **Agniveer Defence Academy**, offering **free training** for
Indian **Army, Navy & Air Force** aspirants — with **free hostel, free education,
free food and free ground**.

- **Director:** Balu Nayak (B.P.Ed, NS NIS, NIS Athletics Coach, National Certified Coach)
- **Phone / WhatsApp:** +91 90105 75723

This is a fast, dependency-free **static website** (HTML + CSS + JavaScript). It can be
hosted for free on Cloudflare Pages or GitHub Pages.

---

## 📁 Project structure

```
Agniveer Defence Academy/
├── index.html        # All page content
├── css/styles.css    # Styling (military green + gold theme, responsive)
├── js/main.js        # Mobile menu, scroll animations, enquiry form
└── README.md
```

---

## 🖥️ Run it locally

You don't need to install anything. Pick one option:

**Option A — just open the file**
Double-click `index.html`. It opens in your browser.

**Option B — local server (recommended, matches production)**

```bash
npx serve .
```

or, with Python:

```bash
python -m http.server 8000
```

Then open http://localhost:8000

---

## 🚀 Deploy later

### 1) Push to GitHub (Balu's account)

```bash
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/<balu-username>/agniveer-defence-academy.git
git push -u origin main
```

### 2) Cloudflare Pages (free hosting)

1. Sign in to Cloudflare with Balu's Gmail account and open **Workers & Pages**.
2. **Create → Pages → Connect to Git** and select the repository.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (root)
4. **Save and Deploy.** Cloudflare gives a free `*.pages.dev` URL, and a custom
   domain can be added later.

> GitHub Pages also works: repo **Settings → Pages → Deploy from branch → main / root**.

---

## ✏️ Editing content

- **Phone number** appears in `index.html` (search for `919010575723`) and in `js/main.js`.
- **Images** use free Unsplash photos via URL. To use your own photos, drop them into an
  `images/` folder and replace the `src="https://images.unsplash.com/..."` links.
- **Colours** are defined once at the top of `css/styles.css` under `:root`.

---

## 📸 Image credits

Placeholder photography from [Unsplash](https://unsplash.com) (free to use under the
Unsplash License). Replace with the academy's own photos before launch for the best result.
