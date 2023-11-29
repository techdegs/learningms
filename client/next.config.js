/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lucide-react"],
  images: {
    domains: ["github.com", "lh3.googleusercontent.com", "res.cloudinary.com"],
  },
};

module.exports = nextConfig
