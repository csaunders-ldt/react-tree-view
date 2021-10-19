'use strict';

import * as vscode from 'vscode';

import { ReactTree, Dependency } from './reactTree';

export function activate(context: vscode.ExtensionContext) {
	const reactTree = new ReactTree();
	vscode.window.registerTreeDataProvider('reactTree', reactTree);
	vscode.commands.registerCommand('reactTree.refreshEntry', () => reactTree.refresh());
	vscode.commands.registerCommand('reactTree.addEntry', () => vscode.window.showInformationMessage(`Successfully called add entry.`));
	vscode.commands.registerCommand('reactTree.editEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
	vscode.commands.registerCommand('reactTree.deleteEntry', (node: Dependency) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));
}