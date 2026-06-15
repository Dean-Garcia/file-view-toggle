import { ExtensionContext, commands } from "vscode";
import {
  addFilesToExcluded,
  getFileVisibilityFileConfigs,
  removeFilesFromExcludeList,
  saveExcludeFiles,
  toggleAllFilesVisibility,
  toggleFolderProperty,
  togglePropertyForFiles,
} from "./utils/configUtils";
import {
  getFileExtension,
  getFileName,
  hiddenFilesProvider,
} from "./utils/fileUtils";
import { FileVisibilityActions } from "./constants";
import { HiddenFileTreeItem } from "./HiddenFileTreeItem";
import { TreeFolderCategories, FileConfigs, FilePatternKeys } from "./types";
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

export const hideFilesWithName = async (
  ...args: [VsCodeFile, Array<VsCodeFile>]
): Promise<void> => {
  const [, files] = args;

  const filesToExclude = files
    .filter((file) => typeof file.path === "string")
    .map((file) => {
      return `**/${getFileName(file.path)}`;
    });
  await addFilesToExcluded(filesToExclude, TreeFolderCategories.EXTENSIONS);

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

// export const showAll = async (item: HiddenFileTreeItem): Promise<void> => {
//   await toggleAllFilesVisibility("show");
// };
// export const hideAll = async (item: HiddenFileTreeItem): Promise<void> => {
//   await toggleAllFilesVisibility("hide");
//   refresh();
// };

export const refresh = (item?: HiddenFileTreeItem): void => {
  if (hiddenFilesProvider) {
    // Refresh HIDDEN FILES view
    hiddenFilesProvider.refresh(item);
    // Refresh EXPLORER view
    commands.executeCommand("workbench.files.action.refreshFilesExplorer");
  }
};

// export const toggleRowVisibility = async (
//   item: HiddenFileTreeItem | TreeFolderItem,
//   allSelectedItems: Array<HiddenFileTreeItem | TreeFolderItem>,
// ): Promise<void> => {
//   const fileObject = togglePropertyForFiles(item, allSelectedItems, "isHidden");
//   await saveExcludeFiles(fileObject);
//   refresh();
// };

// export const toggleFavoriteStatus = async (
//   item: HiddenFileTreeItem | TreeFolderItem,
//   allSelectedItems: Array<HiddenFileTreeItem | TreeFolderItem>,
// ): Promise<void> => {
//   const fileObject = togglePropertyForFiles(
//     item,
//     allSelectedItems,
//     "isFavorite",
//   );
//   await saveExcludeFiles(fileObject);
//   refresh();
// };

// export const toggleLockStatus = async (
//   item: HiddenFileTreeItem | TreeFolderItem,
//   allSelectedItems: Array<HiddenFileTreeItem | TreeFolderItem>,
// ): Promise<void> => {
//   const fileObject = togglePropertyForFiles(item, allSelectedItems, "isLocked");
//   await saveExcludeFiles(fileObject);
//   refresh();
// };

// export const toggleSearchStatus = async (
//   item: HiddenFileTreeItem | TreeFolderItem,
//   allSelectedItems: Array<HiddenFileTreeItem | TreeFolderItem>,
// ): Promise<void> => {
//   const fileObject = togglePropertyForFiles(
//     item,
//     allSelectedItems,
//     "isNotSearchable",
//   );
//   await saveExcludeFiles(fileObject);
//   refresh();
// };

export const registerCommands = (context: ExtensionContext) => {
  const hideFilesCommands: Array<[string, (...args: any[]) => any]> = [
    [FileVisibilityActions.HIDE, hide],
    [FileVisibilityActions.HIDE_FILE_EXTENSION, hideFileExtension],
    [FileVisibilityActions.HIDE_FILE_NAME, hideFilesWithName],

    [
      FileVisibilityActions.TOGGLE_SELECTED,
      (item, allSelectedItems) =>
        togglePropertyForFiles(
          item,
          allSelectedItems,
          FilePatternKeys.isHidden,
        ),
    ],
    [
      FileVisibilityActions.TOGGLE_ROW_VISIBILITY,
      (item, allSelectedItems) =>
        togglePropertyForFiles(
          item,
          allSelectedItems,
          FilePatternKeys.isHidden,
        ),
    ],
    [
      FileVisibilityActions.TOGGLE_FAVORITE_ON,
      (item, allSelectedItems) =>
        togglePropertyForFiles(
          item,
          allSelectedItems,
          FilePatternKeys.isFavorite,
        ),
    ],
    [
      FileVisibilityActions.TOGGLE_FAVORITE_OFF,
      (item, allSelectedItems) =>
        togglePropertyForFiles(
          item,
          allSelectedItems,
          FilePatternKeys.isFavorite,
        ),
    ],
    [
      FileVisibilityActions.TOGGLE_LOCK_ON,
      (item, allSelectedItems) =>
        togglePropertyForFiles(
          item,
          allSelectedItems,
          FilePatternKeys.isLocked,
        ),
    ],
    [
      FileVisibilityActions.TOGGLE_LOCK_OFF,
      (item, allSelectedItems) =>
        togglePropertyForFiles(
          item,
          allSelectedItems,
          FilePatternKeys.isLocked,
        ),
    ],
    [
      FileVisibilityActions.TOGGLE_SEARCH_ON,
      (item, allSelectedItems) =>
        togglePropertyForFiles(
          item,
          allSelectedItems,
          FilePatternKeys.isNotSearchable,
        ),
    ],
    [
      FileVisibilityActions.TOGGLE_SEARCH_OFF,
      (item, allSelectedItems) =>
        togglePropertyForFiles(
          item,
          allSelectedItems,
          FilePatternKeys.isNotSearchable,
        ),
    ],
    [
      FileVisibilityActions.TOGGLE_FOLDER_LOCK,
      (item) => toggleFolderProperty(item, FilePatternKeys.isLocked, true),
    ],
    [
      FileVisibilityActions.TOGGLE_FOLDER_UNLOCK,
      (item) => toggleFolderProperty(item, FilePatternKeys.isLocked, false),
    ],
    [
      FileVisibilityActions.TOGGLE_FOLDER_HIDE,
      (item) => toggleFolderProperty(item, FilePatternKeys.isHidden, true),
    ],
    [
      FileVisibilityActions.TOGGLE_FOLDER_SHOW,
      (item) => toggleFolderProperty(item, FilePatternKeys.isHidden, false),
    ],
    [
      FileVisibilityActions.TOGGLE_FOLDER_SEARCH_ON,
      (item) =>
        toggleFolderProperty(item, FilePatternKeys.isNotSearchable, true),
    ],
    [
      FileVisibilityActions.TOGGLE_FOLDER_SEARCH_OFF,
      (item) =>
        toggleFolderProperty(item, FilePatternKeys.isNotSearchable, false),
    ],
    [FileVisibilityActions.REMOVE, removeFiles],
    [FileVisibilityActions.SHOW_ALL, () => toggleAllFilesVisibility("show")],
    [FileVisibilityActions.HIDE_ALL, () => toggleAllFilesVisibility("hide")],
    [FileVisibilityActions.REFRESH, refresh],
  ];

  for (const [command, handler] of hideFilesCommands) {
    context.subscriptions.push(commands.registerCommand(command, handler));
  }
};
