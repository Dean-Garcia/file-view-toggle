import * as vscode from "vscode";
import * as config from "../../config.json";

export class HiddenFileTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public isHidden: boolean,
    public isLocked: boolean,
    public isNotSearchable: boolean,
    public isFavorite: boolean,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState);

    const favoriteStatus = this.isFavorite ? "favorite" : "notFavorite";
    const lockStatus = this.isLocked ? "locked" : "unlocked";
    const searchStatus = this.isNotSearchable ? "notSearchable" : "searchable";
    const hiddenStatus = this.isHidden ? "hidden" : "visible";

    this.contextValue = `viewableItem-${hiddenStatus}-${favoriteStatus}-${searchStatus}-${lockStatus}`;
    this.iconPath = new vscode.ThemeIcon(this.isHidden ? "eye-closed" : "eye");

    this.tooltip = `Toggle Visibility for ${label}`;
    this.id = `${label}_${isHidden ? "hidden" : "visible"}`;

    // Make the row clickable to handle the eye icon toggle action
    this.command = {
      command: `${config.VIEW_ID}.toggle-row-visibility`,
      title: "Toggle Visibility",
      arguments: [this], // Passes this specific tree item to the action handler
    };
  }
}
