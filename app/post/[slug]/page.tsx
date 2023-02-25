import React from "react";
import { PostImport } from "types/mdx";

interface Props {
	params: {
		slug: string;
	};
}
const Page = async ({ params }: Props) => {
	const { slug } = params;
	const { default: Post, meta }: PostImport = await import(`posts/${slug}.mdx`);
	// const Post: LazyPost = React.lazy(() => import(`posts/${slug}.mdx`));
	return <Post />;
};

export default Page;
