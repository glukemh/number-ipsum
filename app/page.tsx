import CarouselGrid from "components/carousel-grid";
import HelloWorld, { meta } from "posts/hello.mdx";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Number Ipsum",
	description: "Discussing math, code, and sometimes making sense.",
	...meta,
};

const Page = () => {
	return (
		<>
			<HelloWorld />
		</>
		// <CarouselGrid>
		// 	<h1>Number Ipsum</h1>
		// 	<h1>Number Ipsum</h1>
		// 	<h1>Number Ipsum</h1>
		// 	<h1>Number Ipsum</h1>
		// 	<h1>Number Ipsum</h1>
		// 	<h1>Number Ipsum</h1>
		// 	<h1>Number Ipsum</h1>
		// 	<h1>Number Ipsum</h1>
		// 	<h1>Number Ipsum</h1>
		// </CarouselGrid>
	);
};

export default Page;
