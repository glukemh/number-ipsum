declare module "posts/*.mdx" {
	import { PostMeta } from "types/mdx";
	let MDXComponent: (props: any) => JSX.Element;
	export const meta: PostMeta;
	export default MDXComponent;
}
