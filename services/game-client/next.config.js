const gameSettings = require("./game-settings.json");
const configs = require("./configs.json");
const { v4: uuidv4 } = require("uuid");
const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const enableDevGameIdRewrites = !basePath;

// Create a configuration that can be dynamically updated
const createAppSettings = (config) => ({
    ...config,
    gameSettings,
});

const baseAppSettings = createAppSettings(configs);
const buildVersion = new Date().getTime();

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withSentryConfig({
    publicRuntimeConfig: baseAppSettings,
    productionBrowserSourceMaps: false,
    sentry: {
        // Only disable Sentry plugins in development to prevent HMR issues
        disableServerWebpackPlugin: process.env.NODE_ENV === 'development',
        disableClientWebpackPlugin: process.env.NODE_ENV === 'development',
        hideSourceMaps: true,
    },
    generateBuildId: async () => {
        // Use stable build ID in development to prevent HMR issues
        if (process.env.NODE_ENV === 'development' || process.env.NEXT_CONFIG === 'dev') {
            return 'development';
        }
        return uuidv4();
    },
    webpack: (config, options) => {
        // Configure source maps based on environment
        if (options.dev) {
            // Use fast source maps for development
            config.devtool = 'cheap-module-source-map';
        } else {
            // Disable source maps in production for security/performance
            config.devtool = false;
        }

        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|mp3|webp)$/,
            use: {
                loader: "url-loader",
                options: {
                    limit: 100000,
                },
            },
        });

        return config;
    },
    basePath,
    assetPrefix: basePath || undefined,
    env: {
        buildVersion,
        REACT_APP_TOLGEE_API_URL: "https://tolgee.sabagame.com/",
        REACT_APP_TOLGEE_API_KEY: "tgpak_gvpw45brha2xg3btoztxeytunvudc5dbn5twqodtonztc",
    },
    async rewrites() {
        const base = [
            {
                source: "/health",
                destination: "/api/health",
            },
        ];

        // In development, prioritize webpack HMR files
        const developmentRewrites = process.env.NODE_ENV === 'development' ? [
            {
                source: "/_next/webpack-hmr",
                destination: "/_next/webpack-hmr",
            },
            {
                source: "/_next/static/webpack/:path*",
                destination: "/_next/static/webpack/:path*",
            },
        ] : [];

        // Local development service routing
        const localServiceRewrites = [
            // User Service routing
            {
                source: "/user/:path*",
                destination: "http://localhost:8004/:path*",
            },
            // Game API routing
            {
                source: "/game-api/:path*",
                destination: "http://localhost:8002/:path*",
            },
            // Auth API routing
            {
                source: "/auth/:path*",
                destination: "http://localhost:8001/:path*",
            },
            // Game Management Service routing
            {
                source: "/game-management-service/:path*",
                destination: "http://localhost:8005/:path*",
            },
        ];

        // If a basePath is set, support a dynamic :gameId segment after it
        if (basePath) {
            const baseNoSlash = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
            const prodGameIdRewrites = [
                {
                    source: `${baseNoSlash}/:gameId/_next/:path*`,
                    destination: `${baseNoSlash}/_next/:path*`,
                },
                {
                    source: `${baseNoSlash}/:gameId/static/:path*`,
                    destination: `${baseNoSlash}/static/:path*`,
                },
                {
                    source: `${baseNoSlash}/:gameId/:path*`,
                    destination: `${baseNoSlash}/:path*`,
                },
                {
                    source: `${baseNoSlash}/:gameId`,
                    destination: `${baseNoSlash}`,
                },
            ];
            return [...base, ...developmentRewrites, ...localServiceRewrites, ...prodGameIdRewrites];
        }

        // Allow accessing the app under /:gameId/... on localhost without setting basePath
        const devGameIdRewrites = [
            // Assets under _next
            {
                source: "/:gameId/_next/:path*",
                destination: "/_next/:path*",
            },
            // Legacy static (if any)
            {
                source: "/:gameId/static/:path*",
                destination: "/static/:path*",
            },
            // App routes and public assets
            {
                source: "/:gameId/:path*",
                destination: "/:path*",
            },
            {
                source: "/:gameId",
                destination: "/",
            },
        ];

        return [...base, ...developmentRewrites, ...localServiceRewrites, ...devGameIdRewrites];
    },
    async headers() {
        // Different cache policies for development vs production
        const cacheValue = process.env.NODE_ENV === 'development' || process.env.NEXT_CONFIG === 'dev'
            ? "no-cache, no-store, must-revalidate"  // Disable caching in development
            : "public, max-age=31536000, must-revalidate";  // Long-term caching in production

        return [
            {
                source: "/:all*(js|png|json|mp3|webp|svg|jpg|gif)",
                locale: false,
                headers: [
                    {
                        key: "Cache-Control",
                        value: cacheValue,
                    },
                ],
            },
        ];
    },
    sassOptions: {
        prependData: `$version-image: '${buildVersion}';`,
    },
    output: "standalone",
});

module.exports = withBundleAnalyzer(nextConfig);
