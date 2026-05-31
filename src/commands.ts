import { ExtensionContext, commands } from "vscode";
import {
  addFilesToExcluded,
  getFileVisibilityExcludedFiles,
  removeFileFromExcludeList,
  saveExcludeFiles,
} from "./config";
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

export const hideFileExtension = (
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

export const refresh = (item?: HiddenFileTreeItem): void => {
  if (hiddenFilesProvider) {
    // Refresh HIDDEN FILES view
    hiddenFilesProvider.refresh(item);
    // Refresh EXPLORER view
    commands.executeCommand("workbench.files.action.refreshFilesExplorer");
  }
};

export const toggleRowVisibility = async (
  item: HiddenFileTreeItem,
): Promise<void> => {
  const path = item.label;
  const fileObject = getFileVisibilityExcludedFiles();

  if (fileObject[path] !== undefined) {
    fileObject[path] = !fileObject[path];
    console.log(
      fileObject[path],
      `${item.label} should now be`,
      fileObject[path] ? "hidden" : "visible",
    );
  }
  await saveExcludeFiles(fileObject);
  refresh();
};

export const registerCommands = (context: ExtensionContext) => {
  const hideFilesCommands: Array<[string, (...args: any[]) => any]> = [
    [FileVisibilityActions.HIDE, hide],
    [FileVisibilityActions.HIDE_FILE_EXTENSION, hideFileExtension],
    [FileVisibilityActions.TOGGLE_ROW_VISIBILITY, toggleRowVisibility],
    [FileVisibilityActions.SHOW, show],
    [FileVisibilityActions.REFRESH, refresh],
  ];

  for (const [command, handler] of hideFilesCommands) {
    context.subscriptions.push(commands.registerCommand(command, handler));
    $log(`Registred command ${command}`);
  }
};
