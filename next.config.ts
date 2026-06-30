import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com", // الـ home page القديمة
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",    // 👈 السطر السحري لتشغيل صور الـ API الجديدة
      },
    ],
  },
};

export default nextConfig;