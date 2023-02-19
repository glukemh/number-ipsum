import CarouselGrid from "components/server/carousel-grid";
import HelloWorld, { meta } from "./hello.mdx";

const Page = () => {
	return (
		<>
			<h1>{meta.title}</h1>
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
