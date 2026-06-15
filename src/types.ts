import * as config from "../config.json";
import { FILE_VISIBILITY } from "./constants";

/**
 * Type for data stored in file-visiblity.files
 */
export type ExtSettingConfigs = {
  [filePath: string]: {
    shortenedPath: string;
    treeViewFolder: TreeFolderCategories;
    isHidden: boolean;
    isNotSearchable: boolean;
    isLocked: boolean;
    isFavorite: boolean;
  };
};

/**
 *  Type each config rule in FileConfigs
 * @example {package.json: true}
 */
export type PatternRules = {
  [filePath: string]: boolean | string;
};

export type FileConfigs = ExtSettingConfigs[string];

export const FilePatternKeys = {
  isHidden: "isHidden",
  isNotSearchable: "isNotSearchable",
  isLocked: "isLocked",
  isFavorite: "isFavorite",
} as const;

export type FilePatternKeys = keyof Pick<
  FileConfigs,
  "isFavorite" | "isHidden" | "isLocked" | "isNotSearchable"
>;

export const TreeFolderCategories = {
  FAVORITES: "favorites",
  EXTENSIONS: "extensions",
  FILES: "files",
  DEFAULT: "default",
};

export type TreeFolderCategories =
  (typeof TreeFolderCategories)[keyof typeof TreeFolderCategories];

export const FileVisibilityActions = {
  // Context Options
  HIDE: `${FILE_VISIBILITY}.${config.HIDE}`,
  HIDE_FILE_EXTENSION: `${FILE_VISIBILITY}.${config.HIDE_FILE_EXTENSION}`,
  HIDE_FILE_NAME: `${FILE_VISIBILITY}.${config.HIDE_FILE_NAME}`,

  // TreeView Actions
  HIDE_ALL: `${FILE_VISIBILITY}.${config.HIDE_ALL}`,
  SHOW_ALL: `${FILE_VISIBILITY}.${config.SHOW_ALL}`,
  TOGGLE_SELECTED: `${FILE_VISIBILITY}.${config.TOGGLE_SELECTED}`,
  REFRESH: `${FILE_VISIBILITY}.${config.REFRESH}`,

  // TreeItem Actions
  TOGGLE_ROW_VISIBILITY: `${FILE_VISIBILITY}.${config.TOGGLE_ROW_VISIBILITY}`,
  REMOVE: `${FILE_VISIBILITY}.${config.REMOVE}`,
  TOGGLE_FAVORITE_ON: `${FILE_VISIBILITY}.${config.TOGGLE_FAVORITE_ON}`,
  TOGGLE_FAVORITE_OFF: `${FILE_VISIBILITY}.${config.TOGGLE_FAVORITE_OFF}`,
  TOGGLE_SEARCH_ON: `${FILE_VISIBILITY}.${config.TOGGLE_SEARCH_ON}`,
  TOGGLE_SEARCH_OFF: `${FILE_VISIBILITY}.${config.TOGGLE_SEARCH_OFF}`,
  TOGGLE_LOCK_ON: `${FILE_VISIBILITY}.${config.TOGGLE_LOCK_ON}`,
  TOGGLE_LOCK_OFF: `${FILE_VISIBILITY}.${config.TOGGLE_LOCK_OFF}`,

  // TreeFolder Actions
  TOGGLE_FOLDER_LOCK: `${FILE_VISIBILITY}.${config.TOGGLE_FOLDER_LOCK}`,
  TOGGLE_FOLDER_UNLOCK: `${FILE_VISIBILITY}.${config.TOGGLE_FOLDER_UNLOCK}`,
  TOGGLE_FOLDER_HIDE: `${FILE_VISIBILITY}.${config.TOGGLE_FOLDER_HIDE}`,
  TOGGLE_FOLDER_SHOW: `${FILE_VISIBILITY}.${config.TOGGLE_FOLDER_SHOW}`,
  TOGGLE_FOLDER_SEARCH_ON: `${FILE_VISIBILITY}.${config.TOGGLE_FOLDER_SEARCH_ON}`,
  TOGGLE_FOLDER_SEARCH_OFF: `${FILE_VISIBILITY}.${config.TOGGLE_FOLDER_SEARCH_OFF}`,
} as const;

export type FileVisibilityActions =
  (typeof FileVisibilityActions)[keyof typeof FileVisibilityActions];
