import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                hostname: "images.unsplash.com",
            },
            {
                hostname: "storage.googleapis.com",
            },
            {
                hostname: "i.pravatar.cc",
            },
        ],
    },
    compiler: {
        removeConsole:
            process.env.NODE_ENV === "production"
                ? { exclude: ["error"] }
                : false,
    },
};

export default nextConfig;
