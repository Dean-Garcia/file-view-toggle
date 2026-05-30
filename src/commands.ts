import { ExtensionContext, commands } from "vscode";
import { addFilesToExcluded, removeFileFromExcludeList } from "./config";
import { $log, getFileExtension, hiddenFilesProvider } from "./utils";
import { FileVisibilityActions } from "./constants";
import { HiddenFileTreeItem } from "./HiddenFileTreeItem";
import * as vscode from "vscode";
import { HiddenFilesProvider } from "./HiddenFilesProvider";

interface VsCodeFile {
  path: string;
}

export const hide = (...args: [VsCodeFile, Array<VsCodeFile>]): void => {
  const [, files] = args;

  const filesToExclude = files
    .filter((file) => typeof file.path === "string")
    .map((file) => file.path);
  addFilesToExcluded(filesToExclude);

  refresh();
};

export const hideExtension = (
  ...args: [VsCodeFile, Array<VsCodeFile>]
): void => {
  const [, files] = args;

  const filesToExclude = files
    .filter((file) => typeof file.path === "string")
    .map((file) => {
      return `**/*.${getFileExtension(file.path)}`;
    });
  addFilesToExcluded(filesToExclude);

  refresh();
};

export const show = (fileRelativePath: string): void => {
  removeFileFromExcludeList(fileRelativePath);
  refresh();
};

export const refresh = (): void => {
  setTimeout(() => {
    if (hiddenFilesProvider) {
      // Refresh HIDDEN FILES view
      hiddenFilesProvider.refresh();

      // Refresh EXPLORER view
      commands.executeCommand("workbench.files.action.refreshFilesExplorer");
    }
  }, 1000);
};

export const toggleRowVisibility = (item: HiddenFileTreeItem): void => {
  item.isHidden = !item.isHidden;
  item.iconPath = new vscode.ThemeIcon(item.isHidden ? "eye" : "eye-closed");
  hiddenFilesProvider.refresh();
};

export const registerCommands = (context: ExtensionContext) => {
  const hideFilesCommands: Array<[string, (...args: any[]) => any]> = [
    [FileVisibilityActions.HIDE, hide],
    [FileVisibilityActions.HIDE_EXTENSION, hideExtension],
    // [FileVisibilityActions.TOGGLE_ROW_VISIBILITY, toggleRowVisibility],
    [FileVisibilityActions.SHOW, show],
    [FileVisibilityActions.REFRESH, refresh],
  ];

  for (const [command, handler] of hideFilesCommands) {
    context.subscriptions.push(commands.registerCommand(command, handler));
    $log(`Registred command ${command}`);
  }
};
