import { window, ExtensionContext } from "vscode";
import { saveDefaultExclude } from "./config";
import { init, hiddenFilesProvider } from "./utils";

export function activate(context: ExtensionContext) {
  init(context);

  window.registerTreeDataProvider("file-view-toggle", hiddenFilesProvider);
  window.createTreeView("file-view-toggle", {
    treeDataProvider: hiddenFilesProvider,
  });
}

export function deactivate() {
  saveDefaultExclude();
}
