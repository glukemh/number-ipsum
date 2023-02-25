import mdx from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";

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
		remarkPlugins: [remarkGfm, remarkMath],
		rehypePlugins: [rehypeMathjax],
	},
});

export default withMDX(nextConfig);
