export type Post = () => JSX.Element;
export type LazyPost = React.LazyExoticComponent<Post>;
export type PostMeta = {
	title: string;
	author: string;
	date: `${number}-${number}-${number}`; // YYYY-MM-DD
	description: string;
	tags: string[];
};
export type PostImport = {
	default: Post;
	meta: PostMeta;
};
