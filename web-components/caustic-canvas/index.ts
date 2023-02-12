import CausticCanvas from "./class";

if (!window.customElements.get("caustic-canvas")) {
	window.customElements.define("caustic-canvas", CausticCanvas);
}

export default CausticCanvas;
