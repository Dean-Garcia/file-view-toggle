import * as config from "../config.json";

export const FILE_VISIBILITY = config.VIEW_ID;

export const FileVisibilityActions = {
  HIDE: `${FILE_VISIBILITY}.${config.HIDE}`,
  HIDE_ALL: `${FILE_VISIBILITY}.${config.HIDE_ALL}`,
  TOGGLE_SELECTED: `${FILE_VISIBILITY}.${config.TOGGLE_SELECTED}`,
  HIDE_FILE_EXTENSION: `${FILE_VISIBILITY}.${config.HIDE_FILE_EXTENSION}`,
  REFRESH: `${FILE_VISIBILITY}.${config.REFRESH}`,
  REMOVE: `${FILE_VISIBILITY}.${config.REMOVE}`,
  SHOW_ALL: `${FILE_VISIBILITY}.${config.SHOW_ALL}`,
  TOGGLE_ROW_VISIBILITY: `${FILE_VISIBILITY}.${config.TOGGLE_ROW_VISIBILITY}`,
} as const;

export type FileVisibilityActions =
  (typeof FileVisibilityActions)[keyof typeof FileVisibilityActions];
