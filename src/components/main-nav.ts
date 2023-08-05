import "./lo-go.js";
import ShadowElement from "/assets/shadow-element.js";

class MainNav extends ShadowElement {
	nav = this.shadow.querySelector("nav") as HTMLElement;
	constructor() {
		super();
	}
}

if (!customElements.get("main-nav")) {
	customElements.define("main-nav", MainNav);
}

export default MainNav;
