# Put Spirit and Truth College on Hostinger

You need: the file `hostinger-upload-public_html.zip`, and a Hostinger plan with a domain or subdomain (for example `college.yourdomain.com`).

## Upload (about 5 minutes)
1. Log in to **hPanel** at hpanel.hostinger.com.
2. Go to **Websites**, pick your site, and click **Dashboard**.
3. Open **File Manager** (under Files).
4. Open the **public_html** folder. If you want the app on a subdomain, open that subdomain's folder instead (hPanel creates it when you add the subdomain under Domains → Subdomains).
5. If the folder has an old `default.php` or `index.php`, delete it so it doesn't load instead of the app.
6. Click **Upload** and choose `hostinger-upload-public_html.zip`.
7. Right-click the uploaded zip and choose **Extract**. Extract into the current folder (not a new sub-folder). You should now see `index.html`, `manifest.webmanifest`, `sw.js`, the `_expo` folder and the icons directly inside `public_html`.
8. Delete the zip file.
9. Make sure SSL is on: hPanel → **Security → SSL**, install the free SSL for the domain if it isn't active. The app needs `https://` to be installable on phones.
10. Visit your domain. The app should open on today's date.

The hidden `.htaccess` file is included. It forces HTTPS and sets the right file types and caching. If File Manager hides it, that's fine; it's still there.

## Install it on your Android phone from the website
1. Open your site in **Chrome** on the phone.
2. Tap the **⋮** menu → **Add to Home screen** (or **Install app**).
3. It now opens full-screen like an app and works offline.

## Updating later
Run `npx expo export --platform web` in the source folder, zip the contents of `dist/`, and repeat steps 3–8. Your progress is kept, because it lives on your phone or browser, not on the server.

## Important: your progress lives on your device
Ticks and journal notes are stored on the phone or in the browser you use. Use **Settings → Backup** now and then, and use the same backup to move to a new phone.
