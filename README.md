# helpdev.net/surajworks

Suraj V Ghorpade's portfolio — static site (HTML/CSS/JS + Bootstrap 5), no backend, built to run on GitHub Pages.

## Structure

```
CNAME                  -> points GitHub Pages at helpdev.net (apex)
surajworks/            -> the actual site, served at helpdev.net/surajworks
  index.html
  assets/css/style.css
  assets/js/main.js
```

The repo root has no `index.html` of its own, so `helpdev.net` (the apex) will 404 until you
add one — only `helpdev.net/surajworks` is wired up, per your request.

## One-time setup before this goes live

### 1. GitHub Pages
1. Push this folder to a GitHub repo (e.g. `helpdev-site`).
2. Repo Settings → Pages → deploy from the `main` branch, root folder.
3. Because `CNAME` is already in the repo, GitHub will serve the custom domain once DNS is pointed at it.

### 2. GoDaddy DNS
In your GoDaddy DNS settings for `helpdev.net`, add:
- An `A` record for `@` pointing to GitHub Pages' IPs:
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- A `CNAME` record for `www` pointing to `<your-github-username>.github.io` (optional).

DNS propagation can take up to 24–48 hours.

### 3. EmailJS
Two things need to happen in your EmailJS dashboard (emailjs.com):

- **Public key**: open `assets/js/main.js`, find the commented line near the top:
  ```js
  // emailjs.init({ publicKey: "YOUR_PUBLIC_KEY" });
  ```
  Uncomment it and paste your EmailJS public key (Account → API Keys).

- **Visit-notification template** (`template_eebywzc`): fires on every page load (not gated by
  the on-page notice — see below) with fields `from_name`, `ip_address`, `location`, `device_info`,
  `page_url`, `referrer`, `timestamp`. Update the template in EmailJS to match
  `emailjs-templates/visit-notification.html` in this repo — it's your original template with the
  `Email ID` row removed, since browsers cannot expose a visitor's signed-in Google/Gmail identity
  to JavaScript; there was no real data to put in that field.

- **Contact-form template**: you'll need to create a **new** template in EmailJS (the fields differ
  from the visit template — `from_name`, `reply_to`, `message`). Once created, copy its template ID
  and replace `template_contact` near the top of `main.js` with the real ID.

### 4. Visit notice
On load, a small banner tells visitors the site logs anonymous analytics — it has a single "OK"
button that just dismisses it (shown once per browser). It is not a consent gate: the visit
notification email above sends on every page load regardless of whether the banner has been
dismissed. The banner intentionally does not offer a "Decline" that would silently do nothing,
since that would misrepresent what the button does.

### 5. Phone / Instagram
Your WhatsApp number and Instagram handle are stored reversed in `main.js` and only assembled into a
link at the moment a visitor clicks the button — they're never printed as plain text anywhere on the
page. This isn't unbreakable (anyone opening dev tools and reading the JS can reverse the string
back), but it does mean the number/username won't appear if someone just views the page or its
source casually.

## Local preview

Just open `surajworks/index.html` in a browser, or serve the folder with any static server, e.g.:

```
npx serve surajworks
```
