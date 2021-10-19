export interface Node {
	tag: string;
	path: string;
	filePath?: string;
	relativePath?: string;
	children?: Node[];
}


export interface Metadata {
	nodesByLocation: Map<string, Node>;
	folders: string[];
}