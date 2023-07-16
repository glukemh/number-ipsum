import "/components/lo-go";
import shadowElement from "/assets/mixins";
import template from "./template.html?raw";

class MainNav extends shadowElement(template) {
	nav = this.shadow.querySelector("nav") as HTMLElement;
	constructor() {
		super();
	}
}

if (!customElements.get("main-nav")) {
	customElements.define("main-nav", MainNav);
}

export default MainNav;
