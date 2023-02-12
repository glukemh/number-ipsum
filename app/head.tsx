import ElementDefinitions from "components/client/element-definitions";

const Head = () => {
	return (
		<>
			<title>Number Ipsum</title>
			<meta charSet="utf-8" />
			<meta name="description" content="A blog about math and programing" />
			<meta name="keywords" content="Math, Code, Programming" />
			<meta name="author" content="Luke Mendelman-Haenn" />
			<link rel="icon" href="/favicon.ico" />
			<ElementDefinitions />
		</>
	);
};

export default Head;
