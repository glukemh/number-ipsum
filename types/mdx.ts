import type { Metadata } from "next";

export type Post = () => JSX.Element;
export type LazyPost = React.LazyExoticComponent<Post>;
export type PostMeta = Metadata & {
	date: `${number}-${number}-${number}`; // YYYY-MM-DD
};
export type PostImport = {
	default: Post;
	meta: PostMeta;
};
