import { offlineFallback, warmStrategyCache } from "workbox-recipes";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

//configurando o cache
const pageCache = new CacheFirst({
    cacheName: 'twitter-cache',
    plugins: [
        new CacheableResponsePlugin({
            statuses: [0, 200],
        }),
        new ExpirationPlugin({
            maxAgeSeconds: 30 * 24 * 60 * 60
        })
    ]
});

//indicando o cache da pagina
warmStrategyCache({
    urls: ['/index.html', '/'],
    strategy: pageCache,
});

//registrando a rota
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

//configurando o cache de assets
registerRoute(
    ({request}) => ['style', 'script', 'worker'].includes(request.destination),
    new StaleWhileRevalidate({
        cacheName: 'asset-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    }),
);

//configurando offline fallback
offlineFallback({
    pageFallback: '/offline.html',
});