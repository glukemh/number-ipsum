declare module "posts/*.mdx" {
	export const meta: {
		title: string;
		author: string;
		date: `${number}-${number}-${number}`; // YYYY-MM-DD
		description: string;
		tags: string[];
	};
	export default function MDXContent(): JSX.Element;
}
