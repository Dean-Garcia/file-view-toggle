import { window, ExtensionContext } from "vscode";
import { saveDefaultExclude } from "./utils/configUtils";
import { init, hiddenFilesProvider } from "./utils/fileUtils";
import * as vscode from "vscode";
import { HiddenFileTreeItem } from "./HiddenFileTreeItem";
import { FileVisibilityActions } from "./constants";
import * as config from "../config.json";

export function activate(context: ExtensionContext) {
  init(context);

  window.registerTreeDataProvider(config.EXT_ID, hiddenFilesProvider);
  window.createTreeView(config.EXT_ID, {
    treeDataProvider: hiddenFilesProvider,
    canSelectMany: true,
  });
}

export function deactivate() {
  saveDefaultExclude();
}
