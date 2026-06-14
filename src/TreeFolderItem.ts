import * as vscode from "vscode";
import { TreeFolderCategories } from "./types";

// To change icons for folder
const getIconForFolder = (label: TreeFolderCategories) => {
  let folderIcon;
  const category = label.toLocaleLowerCase();
  switch (category) {
    case TreeFolderCategories.FAVORITES:
      folderIcon = "bookmark";
      break;
    case TreeFolderCategories.FILES:
      folderIcon = "files";
      break;
    case TreeFolderCategories.EXTENSIONS:
      folderIcon = "files";
      break;
    case TreeFolderCategories.DEFAULT:
      folderIcon = "settings";
      break;
    default:
      folderIcon = "files";
  }

  return folderIcon;
};

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
