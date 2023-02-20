import { PostMeta } from "types/mdx";

declare module "posts/*.mdx" {
	export const meta: PostMeta;
	export default function MDXContent(): JSX.Element;
}
