import { Metadata, Node } from "./interfaces";
import { workspace } from 'vscode';
import { readFile } from "../utils";
import { parseNodes, getTagName } from "./parser";

// stuff related to trains

export async function getSymbols(): Promise<Metadata> {
	const nodesByLocation = new Map<string, Node>();
	const files = await workspace.findFiles('**/*.{tsx,jsx}');

	files.forEach(({ path }) => {
		const text = readFile(path);
		const children = parseNodes(text, path);
		const tag = getTagName(text, path);
		// Need to get node name
		const extensionlessPath = path.replace(/\..*$/, '');
		const location = `${tag};${extensionlessPath}`;
		const node = { path: extensionlessPath, tag, children, filePath: path };
		nodesByLocation.set(location, node);
	});

	return { nodesByLocation };
}