import * as config from "../config.json";

export const FILE_VISIBILITY = config.VIEW_ID;

export const FileVisibilityActions = {
  HIDE: `${FILE_VISIBILITY}.${config.HIDE}`,
  HIDE_ALL: `${FILE_VISIBILITY}.${config.HIDE_ALL}`,
  HIDE_FILE_EXTENSION: `${FILE_VISIBILITY}.${config.HIDE_FILE_EXTENSION}`,
  REFRESH: `${FILE_VISIBILITY}.${config.REFRESH}`,
  REMOVE: `${FILE_VISIBILITY}.${config.REMOVE}`,
  SHOW_ALL: `${FILE_VISIBILITY}.${config.SHOW_ALL}`,
  TOGGLE_SELECTED: `${FILE_VISIBILITY}.${config.TOGGLE_SELECTED}`,
  TOGGLE_ROW_VISIBILITY: `${FILE_VISIBILITY}.${config.TOGGLE_ROW_VISIBILITY}`,
  TOGGLE_LOCK_ON: `${FILE_VISIBILITY}.${config.TOGGLE_LOCK_ON}`,
  TOGGLE_LOCK_OFF: `${FILE_VISIBILITY}.${config.TOGGLE_LOCK_OFF}`,
  TOGGLE_SEARCH_ON: `${FILE_VISIBILITY}.${config.TOGGLE_SEARCH_ON}`,
  TOGGLE_SEARCH_OFF: `${FILE_VISIBILITY}.${config.TOGGLE_SEARCH_OFF}`,
  TOGGLE_FAVORITE_ON: `${FILE_VISIBILITY}.${config.TOGGLE_FAVORITE_ON}`,
  TOGGLE_FAVORITE_OFF: `${FILE_VISIBILITY}.${config.TOGGLE_FAVORITE_OFF}`,
} as const;

export type FileVisibilityActions =
  (typeof FileVisibilityActions)[keyof typeof FileVisibilityActions];
