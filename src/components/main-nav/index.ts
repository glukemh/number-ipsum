import styles from "./styles.css?raw";
import templateContent from "./template.fragment.html?raw";
import PivotEl from "../pivot-el";

const template = document.createElement("template");
template.innerHTML = templateContent;
const style = document.createElement("style");
style.textContent = styles;
template.content.prepend(style);

class MainNav extends PivotEl {
	static template = template;

	constructor() {
		super();
		const title = new Text(document.title);
		this.pivot("pageTitle", title);
		this.pivot("random", (n) => {
			n.textContent = n.nodeName + 3;
		});
	}

	connectedCallback() {
		super.connectedCallback();
	}
}

if (!customElements.get("main-nav")) {
	customElements.define("main-nav", MainNav);
}

export default MainNav;
