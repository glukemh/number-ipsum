import { notFound } from "next/navigation";
import { extractMetadata } from "utils/markdown";
import Markdown from "components/Markdown";

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
	// const data = await fetchPost(slug);
	// if (!data) {
	// 	notFound();
	// }
	// const post = extractMetadata(data);
	return (
		<p>
			<Markdown>{slug}</Markdown>;
		</p>
	);
};

export default Page;
