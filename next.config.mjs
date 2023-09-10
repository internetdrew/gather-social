/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");
import withPWA from "next-pwa";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "gather-social.s3.us-east-1.amazonaws.com",
      },
    ],
  },
  // async rewrites() {
  //   return [];
  // },
};

const configWithPwa = withPWA({
  disable: process.env.NODE_ENV === "development",
  dest: "public",
  mode: "production",
});

export default configWithPwa(config);
