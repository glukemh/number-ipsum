import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
	children: string;
}

const gfmMarkdown = ({ children }: Props) => {
	return <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>;
};

export default gfmMarkdown;
