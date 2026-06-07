import * as vscode from "vscode";
import { TreeFolderCategories } from "./types";

export class TreeFolderItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly id: TreeFolderCategories,
    public readonly tooltip: string,
  ) {
    super(label, vscode.TreeItemCollapsibleState.Expanded);
    this.iconPath = new vscode.ThemeIcon("folder");
    this.tooltip = tooltip;
    this.contextValue = "folderNode"; // Used to prevent file-specific menus here
  }
}
