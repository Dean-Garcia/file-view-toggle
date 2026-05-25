// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from "vscode";
// import {
//   Dependency,
//   DepNodeProvider,
//   fileViewToggleProvider,
// } from "./TreeDataProvider";

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {
//   const rootPath =
//     vscode.workspace.workspaceFolders &&
//     vscode.workspace.workspaceFolders.length > 0
//       ? vscode.workspace.workspaceFolders[0].uri.fsPath
//       : undefined;

//   // Samples of `window.registerTreeDataProvider`
//   const fileViewToggleProvider = new DepNodeProvider(context, rootPath);
//   vscode.window.registerTreeDataProvider(
//     "fileViewToggle",
//     fileViewToggleProvider,
//   );
//   vscode.commands.registerCommand("fileViewToggle.refreshEntry", () =>
//     fileViewToggleProvider.refresh(),
//   );
//   vscode.commands.registerCommand("fileViewToggle.addEntry", () =>
//     vscode.window.showInformationMessage(`Successfully called add entry.`),
//   );
//   vscode.commands.registerCommand(
//     "fileViewToggle.editEntry",
//     (node: Dependency) =>
//       vscode.window.showInformationMessage(
//         `Successfully called edit entry on ${node.label}.`,
//       ),
//   );
//   vscode.commands.registerCommand(
//     "fileViewToggle.deleteEntry",
//     (node: Dependency) =>
//       vscode.window.showInformationMessage(
//         `Successfully called delete entry on ${node.label}.`,
//       ),
//   );
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}
