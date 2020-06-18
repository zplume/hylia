// This file defines the workbox-cli configuration,
// which is used to generate a list of pre-cache files.

// The 'source' service-worker.js is loaded from here:
//     "/src/_includes/partials/global/service-worker.js"

// ...and the 'destination' service-worker.js
// (including injected pre-cache list) is created here:
//     "/dist/service-worker.js"

// To build "/dist/service-worker.js", run:
//     "npm run workbox:inject"

// ignore VSCode's suggestion to refactor CommonJS to ES6
// as workbox-cli requires this file to use CommonJS module syntax
module.exports = {
  globDirectory: "dist/",
  globPatterns: [
    "**/*.{html,js,woff,woff2}"
  ],
  globIgnores: [
    "admin/*",
    "posts/*/*", // handle blog posts with run-time caching instead
    "contact/*",
    "thank-you/*",
    "js/workbox/**/*"
  ],
  swSrc: "src/_includes/partials/global/service-worker.js",
  swDest: "dist/service-worker.js"
};