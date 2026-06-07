import {
  TreeDataProvider,
  TreeItem,
  EventEmitter,
  Event,
  Command,
  TreeItemCollapsibleState,
} from "vscode";
import { getFileVisibilityFileConfigs } from "./utils/configUtils";
import { FileVisibilityActions } from "./constants";
import { HiddenFileTreeItem } from "./HiddenFileTreeItem";

export class HiddenFilesProvider implements TreeDataProvider<TreeItem> {
  constructor() {}

  getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  getChildren(element?: TreeItem) {
    const files = getFileVisibilityFileConfigs();
    let treeItemChildren: Array<HiddenFileTreeItem> = [];
    for (const [path, props] of Object.entries(files)) {
      const item = new HiddenFileTreeItem(
        path,
        props.isHidden,
        props.isLocked,
        props.isNotSearchable,
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

  refresh(element?: HiddenFileTreeItem): void {
    this._onDidChangeTreeData.fire(element);
  }
}
