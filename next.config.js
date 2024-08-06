/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
	},
	images: {
		domains: ["images.unsplash.com", "1000logos.net", "cloud.appwrite.io"],
	},
};

module.exports = nextConfig;
