/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		appDir: true,
		runtime: "experimental-edge",
	},
	include: ["web-components/*/declarations.d.ts"],
};

module.exports = nextConfig;
