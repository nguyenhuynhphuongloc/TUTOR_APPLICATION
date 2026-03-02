import { withPayload } from "@payloadcms/next/withPayload";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// import { withSentryConfig } from "@sentry/nextjs";
import "./src/env.js";

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

/** @type {import("next").NextConfig} */
const config = withPayload({
  output: "standalone",
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL, process.env.S3_ENDPOINT]
        .filter(Boolean)
        .map((item) => {
          const url = new URL(item);

          return {
            hostname: url.hostname,
            protocol: url.protocol.replace(":", ""),
          };
        }),
    ],
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api', 'import'],
    quietDeps: true,
  },
});
export default config;

// export default withSentryConfig(config, {
//   // For all available options, see:
//   // https://www.npmjs.com/package/@sentry/webpack-plugin#options

//   org: "itts-vr",
//   project: "javascript-nextjs",
//   authToken: process.env.SENTRY_AUTH_TOKEN,

//   // Only print logs for uploading source maps in CI
//   silent: !process.env.CI,

//   // For all available options, see:
//   // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

//   // Upload a larger set of source maps for prettier stack traces (increases build time)
//   widenClientFileUpload: true,

//   // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
//   // This can increase your server load as well as your hosting bill.
//   // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
//   // side errors will fail.
//   tunnelRoute: "/monitoring",

//   webpack: {
//     // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
//     // See the following for more information:
//     // https://docs.sentry.io/product/crons/
//     // https://vercel.com/docs/cron-jobs
//     automaticVercelMonitors: true,

//     // Tree-shaking options for reducing bundle size
//     treeshake: {
//       // Automatically tree-shake Sentry logger statements to reduce bundle size
//       removeDebugLogging: true,
//     },
//   },
// });

// // Injected content via Sentry wizard below

// // const { withSentryConfig } = require("@sentry/nextjs");

// // module.exports = withSentryConfig(module.exports, {
// //   // For all available options, see:
// //   // https://www.npmjs.com/package/@sentry/webpack-plugin#options

// //   org: "itts-vr",
// //   project: "javascript-nextjs",

// //   // Only print logs for uploading source maps in CI
// //   silent: !process.env.CI,

// //   // For all available options, see:
// //   // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// //   // Upload a larger set of source maps for prettier stack traces (increases build time)
// //   widenClientFileUpload: true,

// //   // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// //   // This can increase your server load as well as your hosting bill.
// //   // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// //   // side errors will fail.
// //   tunnelRoute: "/monitoring",

// //   webpack: {
// //     // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// //     // See the following for more information:
// //     // https://docs.sentry.io/product/crons/
// //     // https://vercel.com/docs/cron-jobs
// //     automaticVercelMonitors: true,

// //     // Tree-shaking options for reducing bundle size
// //     treeshake: {
// //       // Automatically tree-shake Sentry logger statements to reduce bundle size
// //       removeDebugLogging: true,
// //     },
// //   },
// // });
