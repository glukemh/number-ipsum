export const extractMetadata = (
	markdown: string
): { markdown: string; metadata: Record<string, string> } => {
	const metadata: Record<string, string> = {};
	const metadataRegex = /^---\s(.*)\s---\s/s;
	const [, metadataString] = markdown.match(metadataRegex) || [];
	if (metadataString) {
		const metadataLines = metadataString.split("\n");
		metadataLines.forEach((line) => {
			const separatorIndex = line.indexOf(":");
			const key = line.slice(0, separatorIndex).trim();
			const value = line.slice(separatorIndex + 1).trim();
			metadata[key] = value;
		});
	}
	return {
		markdown: markdown.replace(metadataRegex, ""),
		metadata,
	};
};
