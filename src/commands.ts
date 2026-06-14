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
import { TreeFolderCategories } from "./types";
import { TreeFolderItem } from "./TreeFolderItem";

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
  await addFilesToExcluded(filesToExclude, TreeFolderCategories.EXTENSIONS);

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
  item: HiddenFileTreeItem | TreeFolderItem,
  allSelectedItems: Array<HiddenFileTreeItem | TreeFolderItem>,
): Promise<void> => {
  const filesToProcess = allSelectedItems || [item];
  const isMultiSelect = filesToProcess.length !== 1;
  const fileObject = { ...getFileVisibilityFileConfigs() };

  for (const item of filesToProcess) {
    if (item instanceof TreeFolderItem) {
      if (isMultiSelect) continue;
      else {
        console.log("toggle all files in folder");
      }
    }
    if (!fileObject[item.label]?.isLocked) {
      fileObject[item.label].isHidden = !fileObject[item.label].isHidden;
    }
  }
  await saveExcludeFiles(fileObject);
  refresh();
};

export const toggleFavoriteStatus = async (
  item: HiddenFileTreeItem,
  allSelectedItems: HiddenFileTreeItem[],
): Promise<void> => {
  const filesToProcess = allSelectedItems || [item];
  const fileObject = { ...getFileVisibilityFileConfigs() };

  for (const item of filesToProcess) {
    fileObject[item.label].isFavorite = !fileObject[item.label].isFavorite;
  }
  await saveExcludeFiles(fileObject);
  refresh();
};

export const toggleLockStatus = async (
  item: HiddenFileTreeItem,
  allSelectedItems: HiddenFileTreeItem[],
): Promise<void> => {
  const filesToProcess = allSelectedItems || [item];
  const fileObject = { ...getFileVisibilityFileConfigs() };

  for (const item of filesToProcess) {
    fileObject[item.label].isLocked = !fileObject[item.label]?.isLocked;
  }
  await saveExcludeFiles(fileObject);
  refresh();
};

export const toggleSearchStatus = async (
  item: HiddenFileTreeItem,
  allSelectedItems: HiddenFileTreeItem[],
): Promise<void> => {
  const filesToProcess = allSelectedItems || [item];
  const fileObject = { ...getFileVisibilityFileConfigs() };

  for (const item of filesToProcess) {
    if (!fileObject[item.label].isLocked) {
      fileObject[item.label].isNotSearchable =
        !fileObject[item.label]?.isNotSearchable;
    }
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
    [FileVisibilityActions.TOGGLE_FAVORITE_ON, toggleFavoriteStatus],
    [FileVisibilityActions.TOGGLE_FAVORITE_OFF, toggleFavoriteStatus],
    [FileVisibilityActions.TOGGLE_LOCK_ON, toggleLockStatus],
    [FileVisibilityActions.TOGGLE_LOCK_OFF, toggleLockStatus],
    [FileVisibilityActions.TOGGLE_SEARCH_ON, toggleSearchStatus],
    [FileVisibilityActions.TOGGLE_SEARCH_OFF, toggleSearchStatus],
    [FileVisibilityActions.REMOVE, removeFiles],
    [FileVisibilityActions.SHOW_ALL, showAll],
    [FileVisibilityActions.HIDE_ALL, hideAll],
    [FileVisibilityActions.REFRESH, refresh],
  ];

  for (const [command, handler] of hideFilesCommands) {
    context.subscriptions.push(commands.registerCommand(command, handler));
  }
};
