import {
  TreeDataProvider,
  TreeItem,
  EventEmitter,
  Event,
  Command,
  TreeItemCollapsibleState,
} from "vscode";
import { getFileVisibilityExcludedFiles } from "./config";
import { FileVisibilityActions } from "./constants";
import { HiddenFileTreeItem } from "./HiddenFileTreeItem";

export class HiddenFilesProvider implements TreeDataProvider<TreeItem> {
  constructor() {}

  getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  getChildren(element?: TreeItem) {
    const files = getFileVisibilityExcludedFiles();
    let treeItemChildren: Array<HiddenFileTreeItem> = [];
    for (const [path, isHidden] of Object.entries(files)) {
      const item = new HiddenFileTreeItem(
        path,
        isHidden,
        TreeItemCollapsibleState.None,
      );
      treeItemChildren.push(item);
    }
    return treeItemChildren;
  }

  private _onDidChangeTreeData: EventEmitter<
    TreeItem | undefined | null | void
  > = new EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: Event<TreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

// class File extends TreeItem {
//   constructor(
//     public readonly label: string,
//     command: Command,
//   ) {
//     super(label, TreeItemCollapsibleState.None);

//     this.command = command;
//   }
// }
