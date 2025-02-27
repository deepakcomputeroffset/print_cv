import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "images.unsplash.com",
            },
            {
                hostname: "res.cloudinary.com",
            },
            {
                hostname: "storage.googleapis.com",
            },
        ],
    },
};

export default nextConfig;
