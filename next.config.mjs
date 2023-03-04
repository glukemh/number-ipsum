/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	pageExtensions: ["ts", "tsx", "js", "jsx"],
	experimental: {
		appDir: true,
		runtime: "experimental-edge",
	},
};

export default nextConfig;
