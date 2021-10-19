import { window, Uri, Command, Event, EventEmitter, TreeDataProvider, TreeItem, TreeItemCollapsibleState, workspace } from 'vscode';
import * as path from 'path';
import { Metadata, Node } from './scanner/interfaces';
import { buildTree } from './treeBuilder';
import { getSymbols } from './scanner';

export class ReactTree implements TreeDataProvider<ReactFile> {
	symbols: Metadata;
	nodes: Map<string, Node>;
	tree: Node[];
	private _onDidChangeTreeData: EventEmitter<ReactFile | undefined | void> = new EventEmitter<ReactFile | undefined | void>();
	readonly onDidChangeTreeData: Event<ReactFile | undefined | void> = this._onDidChangeTreeData.event;

	constructor() {
		this.refresh()
	}

	refresh(): void {
		getSymbols().then(({ nodesByLocation }) => {
			this.nodes = nodesByLocation;
			this.tree = buildTree(nodesByLocation);
			this._onDidChangeTreeData.fire();
		});
	}

	getTreeItem(element: ReactFile): TreeItem {
		return element;
	}

	async getChildren(element?: ReactFile): Promise<ReactFile[]> {
		if (!this.tree)
		return Promise.resolve([]);

		const nodes = element ? element.savedNode?.children : [this.tree[0]];
		return nodes.map(node => new ReactFile(
			node,
			node.children?.length ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None
		));
	}

	open(element?: ReactFile): void {
		const uri = Uri.file(element.node.filePath);
		window.showTextDocument(uri);
	}
}

export class ReactFile extends TreeItem {
	savedNode: Node;

	constructor(
		public readonly node: Node,
		public readonly collapsibleState: TreeItemCollapsibleState,
		public readonly command?: Command
	) {
		super(node.tag, collapsibleState);

		this.savedNode = node;
		this.tooltip = node.tag;
		this.description = node.relativePath;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';
}
