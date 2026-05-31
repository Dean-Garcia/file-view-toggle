import * as vscode from "vscode";
import * as config from "../config.json";

export class HiddenFileTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public isHidden: boolean,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
  ) {
    // Step 1: Pass the clean string label without any formatting markup
    super(label, collapsibleState);

    // Step 2: VS Code renders the ThemeIcon natively on the LEFT side of the text label
    // this.iconPath = new vscode.ThemeIcon(isHidden ? "eye" : "eye-closed");

    // Step 3: Keep the context tag intact so your right-hand Delete icon still functions
    this.contextValue = isHidden
      ? "viewableItem_visible"
      : "viewableItem_hidden";

    this.updateVisuals();
    this.tooltip = `Toggle Visibility for ${label}`;
    this.id = `${label}_${isHidden ? "hidden" : "visible"}`;

    // Step 4: Make the row clickable to handle the eye icon toggle action
    this.command = {
      command: `${config.VIEW_ID}.toggle-row-visibility`,
      title: "Toggle Visibility",
      arguments: [this], // Passes this specific tree item to the action handler
    };
  }

  public updateVisuals() {
    this.iconPath = new vscode.ThemeIcon(this.isHidden ? "eye-closed" : "eye");
    this.contextValue = this.isHidden
      ? "viewableItem_visible"
      : "viewableItem_hidden";
  }
}
