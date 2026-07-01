import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        root: __dirname,
    },
    // link-preview-js (and its cheerio dependency) are server-only; keep them
    // out of the bundle so the server action runs them in the Node runtime.
    serverExternalPackages: ["link-preview-js"],
};

export default nextConfig;
