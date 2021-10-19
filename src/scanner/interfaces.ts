export interface Node {
	tag: string;
	path: string;
	filePath?: string;
	children?: Node[];
}


export interface Metadata {
	nodesByLocation: Map<string, Node>;
}