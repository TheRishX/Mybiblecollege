# Spirit and Truth College (React Native / Expo)

A two-year self-study Bible college app. One codebase runs as:
- a **website** you upload to Hostinger (it can also be installed on a phone's home screen), and
- an **Android app** (and iOS if you want later), built with Expo.

## What's inside
- `App.js`: the app shell and bottom tabs
- `src/plan.js`: the curriculum, Bible reading plan, memory verses and the engine that turns a date into that day's tasks
- `src/guide.js`: "why it matters / what happens" for every practice, notes on all 66 books, season notes and daily tips
- `src/screens.js`: Today, Calendar, Progress, Roadmap and Settings screens
- `src/store.js`: saves progress on the device, with backup export/import
- `public/`: website extras (install manifest, offline support, Hostinger `.htaccess`)

## Run it on your computer
1. Install Node.js 20 or newer.
2. In this folder: `npm install`
3. `npx expo start` then press `w` for the browser, or scan the QR code with the Expo Go app on your Android phone.

## Build the website for Hostinger
`npx expo export --platform web` creates a `dist/` folder. Upload everything inside `dist/` (including the hidden `.htaccess` file) to your site's `public_html` folder. See `HOSTINGER-UPLOAD.md` for click-by-click steps.

## Build the Android app (APK)
1. Create a free account at expo.dev.
2. `npm install -g eas-cli` then `eas login`
3. `eas build -p android --profile preview` gives you an `.apk` download link you can install on any Android phone.
4. For the Google Play Store use `eas build -p android --profile production` (an `.aab` file) and upload it in the Play Console (one-time $25 developer fee).
