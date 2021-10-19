import * as vscode from 'vscode';
import * as path from 'path';
import { Metadata, Node } from './scanner/interfaces';
import { buildTree } from './treeBuilder';

export class ReactTree implements vscode.TreeDataProvider<Dependency> {
	symbols: Metadata;
	tree: Node[];
	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

	constructor() {
		this.refresh()
	}

	refresh(): void {
		buildTree().then(tree => {
			this.tree = tree
			this._onDidChangeTreeData.fire();
			console.log(JSON.stringify(tree))
		});
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		console.log(element);
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		return Promise.resolve([]);
	}
}

export class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		private readonly version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}-${this.version}`;
		this.description = this.version;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';
}
