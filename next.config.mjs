import mdx from "@next/mdx";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
	experimental: {
		appDir: true,
		runtime: "experimental-edge",
	},
};

const withMDX = mdx({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [remarkGfm],
	},
});

export default withMDX(nextConfig);
