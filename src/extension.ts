import { window, ExtensionContext } from "vscode";
import { saveDefaultExclude } from "./config";
import { init, hiddenFilesProvider } from "./utils";
import * as vscode from "vscode";
import { HiddenFileTreeItem } from "./HiddenFileTreeItem";
import { FileVisibilityActions, TREE_VIEW_ID } from "./constants";

export function activate(context: ExtensionContext) {
  init(context);

  window.registerTreeDataProvider(TREE_VIEW_ID, hiddenFilesProvider);
  window.createTreeView(TREE_VIEW_ID, {
    treeDataProvider: hiddenFilesProvider,
  });

  // This command triggers whenever the user selects the tree view item row
  context.subscriptions.push(
    vscode.commands.registerCommand(
      FileVisibilityActions.TOGGLE_ROW_VISIBILITY,
      (item: HiddenFileTreeItem) => {
        item.isHidden = !item.isHidden;
        item.updateVisuals();
        console.log("item", item.isHidden, item.iconPath);
        hiddenFilesProvider.refresh(); // Requests a redraw to swap the eye icon state
      },
    ),
  );
}

export function deactivate() {
  saveDefaultExclude();
}
