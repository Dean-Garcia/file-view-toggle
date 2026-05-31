import * as config from "../config.json";

export const FILE_VISIBILITY = config.VIEW_ID;

export const FileVisibilityActions = {
  HIDE: `${FILE_VISIBILITY}.${config.HIDE}`,
  HIDE_FILE_EXTENSION: `${FILE_VISIBILITY}.${config.HIDE_FILE_EXTENSION}`,
  REFRESH: `${FILE_VISIBILITY}.${config.REFRESH}`,
  SHOW: `${FILE_VISIBILITY}.${config.SHOW}`,
  TOGGLE_ROW_VISIBILITY: `${FILE_VISIBILITY}.${config.TOGGLE_ROW_VISIBILITY}`,
} as const;

export type FileVisibilityActions =
  (typeof FileVisibilityActions)[keyof typeof FileVisibilityActions];
