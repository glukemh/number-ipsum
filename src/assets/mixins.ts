type RangeTemplateMixin = {
	new (...args: any[]): {
		getRangeMap: (root: Node) => Map<string, Range>;
		rangeElements: (range: Range) => NodeIterator;
	};
};

export default class ShadowDOMElement extends HTMLElement {
	shadow: ShadowRoot;
	constructor() {
		super();

		if (this.shadowRoot) {
			this.shadow = this.shadowRoot;
		} else {
			const template = this.querySelector(
				"template[shadowrootmode]"
			) as HTMLTemplateElement;
			const attributeMode = template.getAttribute("shadowrootmode");
			const mode: ShadowRootMode =
				attributeMode === "open" || attributeMode === "closed"
					? attributeMode
					: "open";
			this.shadow = this.attachShadow({ mode });
			this.shadow.appendChild(template.content);
		}
	}
}

export const rangeTemplateMixin = <T extends new (...args: any[]) => any>(
	Base: T
): RangeTemplateMixin & T => {
	return class RangeTemplateElement extends Base {
		constructor(...args: any[]) {
			super(...args);
		}
		getRangeMap(root: Node) {
			const commentNodes = document.createNodeIterator(
				root,
				NodeFilter.SHOW_COMMENT
			);
			const rangeMap = new Map<string, Range>();
			const comments = [];
			for (
				let currentNode = commentNodes.nextNode() as Comment;
				currentNode;
				currentNode = commentNodes.nextNode() as Comment
			) {
				if (currentNode.nodeValue?.startsWith("start:")) {
					const key = currentNode.nodeValue.slice(6);
					const range = document.createRange();
					range.setStartBefore(currentNode);
					rangeMap.set(key, range);
				} else if (currentNode.nodeValue?.startsWith("end:")) {
					const key = currentNode.nodeValue.slice(4);
					const range = rangeMap.get(key);
					if (range) {
						range.setEndAfter(currentNode);
					}
				} else if (currentNode.nodeValue?.startsWith(":")) {
					const key = currentNode.nodeValue.slice(1);
					const range = document.createRange();
					range.selectNode(currentNode);
					rangeMap.set(key, range);
				}
				comments.push(currentNode);
			}
			comments.forEach((comment) => comment.remove());
			return rangeMap;
		}
		rangeElements(range: Range) {
			const firstNode = range.startContainer.childNodes[range.startOffset];
			const lastNode = range.endContainer.childNodes[range.endOffset - 1];
			if (!firstNode || !lastNode) {
				throw new Error("Range is not valid");
			}
			return document.createNodeIterator(
				range.commonAncestorContainer,
				NodeFilter.SHOW_ELEMENT,
				(node) => {
					if (
						firstNode.compareDocumentPosition(node) &
							Node.DOCUMENT_POSITION_FOLLOWING &&
						lastNode.compareDocumentPosition(node) &
							Node.DOCUMENT_POSITION_PRECEDING
					) {
						return NodeFilter.FILTER_ACCEPT;
					} else {
						return NodeFilter.FILTER_REJECT;
					}
				}
			);
		}
	};
};
