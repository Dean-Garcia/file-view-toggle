import { ExtensionContext, commands } from "vscode";
import {
  addFilesToExcluded,
  getFileVisibilityFileConfigs,
  removeFilesFromExcludeList,
  saveExcludeFiles,
  toggleAllFilesVisibility,
} from "./utils/configUtils";
import { getFileExtension, hiddenFilesProvider } from "./utils/fileUtils";
import { FileVisibilityActions } from "./constants";
import { HiddenFileTreeItem } from "./HiddenFileTreeItem";
import { FilePatternProps } from "./types";

interface VsCodeFile {
  path: string;
}

export const hide = async (
  ...args: [VsCodeFile, Array<VsCodeFile>]
): Promise<void> => {
  const [, files] = args;

  const filesToExclude = files
    .filter((file) => typeof file.path === "string")
    .map((file) => file.path);
  await addFilesToExcluded(filesToExclude);

  refresh();
};

export const hideFileExtension = async (
  ...args: [VsCodeFile, Array<VsCodeFile>]
): Promise<void> => {
  const [, files] = args;
  const filesToExclude = files
    .filter((file) => typeof file.path === "string")
    .map((file) => {
      return `**/*.${getFileExtension(file.path)}`;
    });
  await addFilesToExcluded(filesToExclude);

  refresh();
};

export const removeFiles = async (
  item: HiddenFileTreeItem,
  allSelectedItems: HiddenFileTreeItem[],
): Promise<void> => {
  const filesToProcess = allSelectedItems || [item];
  await removeFilesFromExcludeList(filesToProcess);
  refresh();
};

export const showAll = async (item: HiddenFileTreeItem): Promise<void> => {
  await toggleAllFilesVisibility("show");
  refresh();
};
export const hideAll = async (item: HiddenFileTreeItem): Promise<void> => {
  await toggleAllFilesVisibility("hide");
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
  allSelectedItems: HiddenFileTreeItem[],
): Promise<void> => {
  const filesToProcess = allSelectedItems || [item];
  const fileObject = { ...getFileVisibilityFileConfigs() };

  for (const item of filesToProcess) {
    fileObject[item.label].isHidden = !fileObject[item.label]?.isHidden;
  }
  await saveExcludeFiles(fileObject);
  refresh();
};

export const registerCommands = (context: ExtensionContext) => {
  const hideFilesCommands: Array<[string, (...args: any[]) => any]> = [
    [FileVisibilityActions.HIDE, hide],
    [FileVisibilityActions.TOGGLE_SELECTED, toggleRowVisibility],
    [FileVisibilityActions.HIDE_FILE_EXTENSION, hideFileExtension],
    [FileVisibilityActions.TOGGLE_ROW_VISIBILITY, toggleRowVisibility],
    [FileVisibilityActions.REMOVE, removeFiles],
    [FileVisibilityActions.SHOW_ALL, showAll],
    [FileVisibilityActions.HIDE_ALL, hideAll],
    [FileVisibilityActions.REFRESH, refresh],
  ];

  for (const [command, handler] of hideFilesCommands) {
    context.subscriptions.push(commands.registerCommand(command, handler));
  }
};
