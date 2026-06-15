import { ExtensionContext, commands } from "vscode";
import {
  addFilesToExcluded,
  removeFilesFromExcludeList,
  toggleAllFilesVisibility,
  toggleFolderProperty,
  togglePropertyForFiles,
} from "./utils/configUtils";
import {
  getFileExtension,
  getFileName,
  hiddenFilesProvider,
} from "./utils/fileUtils";
import { HiddenFileTreeItem } from "./classes/HiddenFileTreeItem";
import {
  TreeFolderCategories,
  FilePatternKeys,
  FileVisibilityActions,
} from "./types";

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

// export const removeFiles = async (
//   item: HiddenFileTreeItem,
//   allSelectedItems: HiddenFileTreeItem[],
// ): Promise<void> => {
//   const filesToProcess = allSelectedItems || [item];
//   await removeFilesFromExcludeList(filesToProcess);
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
    [
      FileVisibilityActions.REMOVE,
      (item, allSelectedItems) =>
        removeFilesFromExcludeList(item, allSelectedItems),
    ],
    [FileVisibilityActions.SHOW_ALL, () => toggleAllFilesVisibility("show")],
    [FileVisibilityActions.HIDE_ALL, () => toggleAllFilesVisibility("hide")],
    [FileVisibilityActions.REFRESH, refresh],
  ];

  for (const [command, handler] of hideFilesCommands) {
    context.subscriptions.push(commands.registerCommand(command, handler));
  }
};
