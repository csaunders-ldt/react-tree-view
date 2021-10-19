import { Metadata, Node } from "./interfaces";
import { workspace } from 'vscode';
import { readFile } from "../utils";
import { parseNodes, getTagName } from "./parser";

// stuff related to trains

export async function getSymbols(): Promise<Metadata> {
	const nodesByLocation = new Map<string, Node>();
	const files = await workspace.findFiles('**/*.{tsx,jsx}');
	const folders = workspace.workspaceFolders.map(({uri}) => uri?.path);

	files.forEach(({ path }) => {
		const text = readFile(path);
		const children = parseNodes(text, path);
		const tag = getTagName(text, path);

		// Need to get node name
		const extensionlessPath = path.replace(/\..*$/, '');
		const location = `${tag};${extensionlessPath}`;
		const relativePath = folders.reduce(
			(path, folder) => path.replace(folder, ''), path);

		const node = {
			path: extensionlessPath,
			tag, children,
			filePath: path,
			relativePath
		};
		nodesByLocation.set(location, node);
	});

	return { nodesByLocation, folders };
}