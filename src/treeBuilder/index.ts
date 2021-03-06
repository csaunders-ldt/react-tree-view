import { Node, } from "../scanner/interfaces";

export function buildTree(nodesByLocation: Map<string, Node>): Node[] {
	const parentNodes = new Map<string, Node>();
	const childNodes = new Set<string>();

	[...nodesByLocation.entries()].forEach(([location, node]) => {
		node.children = node.children.map(({ tag, path }) => {
			const childLocation = `${tag};${path}`;
			parentNodes.delete(childLocation);
			childNodes.add(childLocation);
			return nodesByLocation.get(childLocation);
		});

		if (childNodes.has(location)) return;

		parentNodes.set(location, node);
	});

	return [...parentNodes.values()];
}