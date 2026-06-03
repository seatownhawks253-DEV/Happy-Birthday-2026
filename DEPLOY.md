# Put your birthday party online (free)

Your site is plain HTML/CSS/JS — it works on any free static host with **HTTPS** (needed for sound in most browsers).

## Fastest: Netlify Drop (about 1 minute)

1. Open **[https://app.netlify.com/drop](https://app.netlify.com/drop)** in your browser.
2. Drag the whole **`HappyBirthday`** folder onto the page (or use `happybirthday-site.zip` from this folder).
3. Netlify gives you a URL like `https://random-name-123.netlify.app` — share that link.

Optional: sign in to Netlify to **rename** the site (Site settings → Domain management → Options → Edit site name).

---

## GitHub Pages (good if you use GitHub)

1. Create a new repo on GitHub (e.g. `happy-birthday-party`).
2. Push this folder:

   ```bash
   cd HappyBirthday
   git init
   git add index.html styles.css app.js netlify.toml .nojekyll .github README.md DEPLOY.md
   git commit -m "Add birthday DJ party site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment → Source**: **GitHub Actions**.
4. After the workflow runs, your site is at:

   `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## Other hosts

| Service | What to do |
|--------|------------|
| [Cloudflare Pages](https://pages.cloudflare.com/) | Connect repo or upload folder |
| [Vercel](https://vercel.com/new) | Import project, framework: Other, no build command |
| [Tiiny Host](https://tiiny.host/) | Upload `happybirthday-site.zip` |

---

## Zip for upload

From this folder, run:

```bash
python3 make_zip.py
```

That creates **`happybirthday-site.zip`** with only the files needed for the live site.
