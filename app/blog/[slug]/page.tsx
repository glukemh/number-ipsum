import { notFound } from "next/navigation";
import { extractMetadata } from "utils/markdown";
import Markdown from "components/Markdown";
import { isPropertyAccessChain } from "typescript";

interface Props {
	params: {
		slug: string;
	};
}

const fetchPost = async (slug: string) => {
	const res = await fetch(
		`https://pub-2167d7580202441ba01517c9fc08d4ab.r2.dev/${slug}.md`
	);
	return res.ok ? await res.text() : null;
};

const Page = async ({ params }: Props) => {
	const { slug } = params;
	const data = await fetchPost(slug);
	if (!data) {
		notFound();
	}
	const post = extractMetadata(data);
	return (
		<p>
			<span>{process.env.R2_BUCKET}</span>
			<Markdown>{post.markdown}</Markdown>;
		</p>
	);
};

export default Page;