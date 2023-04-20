import styles from "./styles.css?raw";
import templateContent from "./template.fragment.html?raw";
import ReactiveEl from "../reactive-el";

const template = document.createElement("template");
template.innerHTML = templateContent;
const style = document.createElement("style");
style.textContent = styles;
template.content.prepend(style);

class MainNav extends ReactiveEl {
	#pageTitle: string | null = null;
	#random: number = 0;
	static template = template;

	constructor() {
		super();
		this.pageTitle = document.title;
	}

	connectedCallback() {
		super.connectedCallback();
	}

	set pageTitle(value: string | null) {
		this.#pageTitle = value;
		super.set("pageTitle", value);
	}

	get pageTitle(): string | null {
		return this.#pageTitle;
	}

	get random(): number {
		return this.#random;
	}

	set random(value: number) {
		this.#random = value;
		super.set("random", value.toString());
	}
}

if (!customElements.get("main-nav")) {
	customElements.define("main-nav", MainNav);
}

export default MainNav;
