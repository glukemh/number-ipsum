"use client";
import { useEffect } from "react";
import registry from "utils/web-component-registry";
const ElementDefinitions = () => {
	useEffect(() => {
		document.querySelectorAll(":not(:defined)").forEach((el) => {
			const dynamicImport = registry[el.localName];
			if (!dynamicImport) {
				console.error(
					`No import found for ${el.localName} in utils/web-component-registry.ts`
				);
			} else {
				dynamicImport();
			}
		});
	}, []);
	return null;
};

export default ElementDefinitions;
