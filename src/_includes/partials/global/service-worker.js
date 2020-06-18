importScripts("/js/workbox/workbox-v5.1.3/workbox-sw.js");
workbox.setConfig({
  modulePathPrefix: "/js/workbox/workbox-v5.1.3/"
});

const { CacheFirst, NetworkOnly, StaleWhileRevalidate } = workbox.strategies;
const { clientsClaim, skipWaiting } = workbox.core;
const { precacheAndRoute, matchPrecache } = workbox.precaching;
const { registerRoute, setDefaultHandler, setCatchHandler } = workbox.routing;

const maxAgeSeconds24Hours = 24 * 60 * 60;

function coreConfig() {
	clientsClaim();
	skipWaiting();
}

function preCache() {
	// precacheAndRoute() parameters are injected by the output
	// of workbox-cli injectManifest.
	precacheAndRoute(self.__WB_MANIFEST);
}

function runtimeCache() {
  // blog posts: load from cache if possible
  // but also check the network in parallel
  // for any updates
	registerRoute(
		/posts\/[^\/]+\/$/i,
		new StaleWhileRevalidate({
			cacheName: "posts",
			expiration: {
				maxEntries: 10,
				maxAgeSeconds: maxAgeSeconds24Hours
			}
		})
	);

	// images: load from cache if possible
	registerRoute(
		({ request }) => request.destination === "image",
		new CacheFirst({
			cacheName: "images",
			expiration: {
				maxEntries: 60,
				maxAgeSeconds: maxAgeSeconds24Hours
			}
		})
  );
}

function offlinePage() {
  // strategy for 3rd party requests and
  // anything not handled by the pre-caching /
  // runtime caching defined above:
  // no caching, always use the network
  setDefaultHandler(new NetworkOnly());
  
	// show "/offline/index.html" if the user requests a page
	// that does not exist in the cache while offline
	setCatchHandler(({ request }) => {
			if (request.destination === "document") {
				return matchPrecache("/offline/index.html");
			}
			else {
				return Response.error();
			}
  });
}

function enableServiceWorker() {
	coreConfig();
	preCache();
	runtimeCache();
	offlinePage();
}

if(self.location.hostname !== "localhost") {
	enableServiceWorker();
}