import * as config from "../config.json";

export const FILE_VISIBILITY = config.VIEW_ID;

export const FileVisibilityActions = {
  HIDE: `${FILE_VISIBILITY}.hide`,
  HIDE_FILE_EXTENSION: `${FILE_VISIBILITY}.hide-file-extension`,
  REFRESH: `${FILE_VISIBILITY}.refresh`,
  SHOW: `${FILE_VISIBILITY}.show`,
  TOGGLE_HIDE: `${FILE_VISIBILITY}.toggle-hide`,
  TOGGLE_ROW_VISIBILITY: `${FILE_VISIBILITY}.toggle-row-visibility`,
} as const;

export type FileVisibilityActions =
  (typeof FileVisibilityActions)[keyof typeof FileVisibilityActions];
