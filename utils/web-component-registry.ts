const registry: Record<string, () => Promise<any>> = {
	"caustic-canvas": () => import("web-components/caustic-canvas"),
	"form-wrapper": () => import("web-components/form-wrapper"),
};

export default registry;
