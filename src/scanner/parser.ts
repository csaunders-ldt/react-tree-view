import { Node } from "./interfaces";
import { dirname, join, sep } from 'path';

function getImports(fileContent: string, directory: string) {
	const imports = fileContent.matchAll(
		/import[\s{]+([^\s}]*)[\s}]*from[\s]['"](.*)['"]/gm
	);

	const convertedImports = [...imports].map(([, node, importPath]) => {
		const newPath = importPath[0] === '.' ?
			join(directory, importPath) :
			importPath;
		const extensionlessPath = newPath.replace(/\..*$/, '');
		return [node, extensionlessPath] as [string, string];
	}).filter(([, path]) => path[0] === '/');
	return new Map(convertedImports);
}

function getNodes(fileContent: string): string[] {
	const possibleTags = fileContent.matchAll(
		/<\s*([^ /][^ >/]*).*>/gm
	);
	return [...possibleTags].map(([, content]) => content);
}

export function parseNodes(fileContent: string, path: string): Node[] {
	const importsByNode = getImports(fileContent, dirname(path));
	const possibleTags = getNodes(fileContent);
	return possibleTags
		.filter(Boolean)
		.filter((tag) => importsByNode.has(tag))
		.map((tag) => ({
			tag,
			path: importsByNode.get(tag)
		}));
}

export function getTagName(fileContent: string, fileName: string): string {
	const defaultExport = fileContent.match(/export default ([^;\s]*)/m);
	if (defaultExport) return defaultExport[1];

	return fileName.match(new RegExp(`([^${sep}]*)/.(tsx?|jsx?)$`))[1];
}