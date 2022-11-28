import Markdown from "components/Markdown";

const Page = async () => {
	// const data = await fetchPost(slug);
	// if (!data) {
	// 	notFound();
	// }
	// const post = extractMetadata(data);
	return (
		<p>
			<Markdown># test page</Markdown>;
		</p>
	);
};

export default Page;
