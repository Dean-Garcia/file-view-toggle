import {
  TreeDataProvider,
  TreeItem,
  EventEmitter,
  Event,
  Command,
  TreeItemCollapsibleState,
} from "vscode";
import { getFileVisibilityFileConfigs } from "./../utils/configUtils";
import { HiddenFileTreeItem } from "./HiddenFileTreeItem";
import { TreeFolderItem } from "./TreeFolderItem";
import { TreeFolderCategories } from "./../types";

export class HiddenFilesProvider implements TreeDataProvider<
  TreeFolderItem | TreeItem
> {
  constructor() {}

  getTreeItem(element: TreeFolderItem | TreeItem): TreeItem {
    return element;
  }

  async getChildren(element?: TreeItem | TreeFolderItem) {
    // 1. Root Level: Return the three sections
    if (!element) {
      return [
        new TreeFolderItem(
          "Favorites",
          "favorites",
          "Designated Favorite Files",
        ),
        new TreeFolderItem("Files", "files", "Hidden Files"),
        new TreeFolderItem(
          "Extensions / Names",
          "extensions",
          "Hidden Extensions and Files with a Specific Name",
        ),
        new TreeFolderItem(
          "Default",
          "default",
          "Files designated in files.exclude by default outside the extension",
        ),
      ];
    }

    // 2. Child Level: Only folders have children
    if (element instanceof TreeFolderItem) {
      return this.getChildrenForFolder(element.id);
    }

    // Files have no children
    return [];
  }

  private getChildrenForFolder(folderId: TreeFolderCategories): TreeItem[] {
    const filesConfig = getFileVisibilityFileConfigs();
    let treeItemChildren: Array<TreeItem> = [];

    for (const [path, props] of Object.entries(filesConfig)) {
      // Figure out if file matches the folder
      const isInFolder =
        filesConfig[path] && filesConfig[path].treeViewFolder === folderId;

      // Determine if it should go to favorites
      const isFavorite = filesConfig[path] && filesConfig[path].isFavorite;

      // Since this is called per folder vs per file ultimately, need to filter what needs to go in
      // Add favorites to favorites folder
      if (folderId === TreeFolderCategories.FAVORITES && isFavorite) {
        const item = new HiddenFileTreeItem(
          path,
          props.isHidden,
          props.isLocked,
          props.isNotSearchable,
          props.isFavorite,
          TreeItemCollapsibleState.None,
        );
        treeItemChildren.push(item);
      } else if (isInFolder && !isFavorite) {
        // Else create normally and filter out favorites
        const item = new HiddenFileTreeItem(
          path,
          props.isHidden,
          props.isLocked,
          props.isNotSearchable,
          props.isFavorite,
          TreeItemCollapsibleState.None,
        );
        treeItemChildren.push(item);
      }
    }

    return treeItemChildren;
  }

  private _onDidChangeTreeData: EventEmitter<
    TreeItem | undefined | null | void
  > = new EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: Event<TreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(element?: HiddenFileTreeItem): void {
    this._onDidChangeTreeData.fire(element);
  }
}
