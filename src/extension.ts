'use strict';

import * as vscode from 'vscode';

import { ReactTree, ReactFile } from './reactTree';

export function activate(context: vscode.ExtensionContext) {
	const reactTree = new ReactTree();
	vscode.window.registerTreeDataProvider('reactTree', reactTree);
	vscode.commands.registerCommand('reactTree.refreshEntry', () => reactTree.refresh());
	vscode.commands.registerCommand('reactTree.addEntry', () => vscode.window.showInformationMessage(`Successfully called add entry.`));
	vscode.commands.registerCommand('reactTree.editEntry', (node: ReactFile) => reactTree.open(node));
	vscode.commands.registerCommand('reactTree.deleteEntry', (node: ReactFile) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));
}