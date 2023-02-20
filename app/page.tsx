import CarouselGrid from "components/carousel-grid";
import HelloWorld, { meta } from "posts/hello.mdx";

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
