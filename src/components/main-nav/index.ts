import styles from "./styles.css?raw";
import templateContent from "./template.fragment.html?raw";
import PivotEl from "../pivot-el";

const template = document.createElement("template");
template.innerHTML = templateContent;
const style = document.createElement("style");
style.textContent = styles;
template.content.prepend(style);

class MainNav extends PivotEl {
	#pageTitle: string = "";
	#random: number = Math.random();
	static template = template;

	constructor() {
		super();
		this.pageTitle = document.title;
		this.random = this.random;
	}

	connectedCallback() {
		super.connectedCallback();
	}

	set pageTitle(value: string) {
		this.#pageTitle = value;
		this.pivot("pageTitle", new Text(value));
	}

	get pageTitle(): string {
		return this.#pageTitle;
	}

	get random(): number {
		return this.#random;
	}

	set random(value: number) {
		this.#random = value;
		const attr = this.get("random") as Attr;
		attr.value = value.toString();
		this.pivot("random");
	}
}

if (!customElements.get("main-nav")) {
	customElements.define("main-nav", MainNav);
}

export default MainNav;
