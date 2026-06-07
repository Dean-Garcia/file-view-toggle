/**
 * Type for data stored in file-visiblity.files
 */
export type HiddenFilePatternConfigs = {
  [filePath: string]: {
    shortenedPath: string;
    treeViewFolder: TreeFolderCategories;
    isHidden: boolean;
    isNotSearchable: boolean;
    isLocked: boolean;
  };
};

/**
 *  Type each config rule in FilePatternProps
 * @example {package.json: true}
 */
export type PatternRules = {
  [filePath: string]: boolean | string;
};

/**
 *  Type for properties stored per pattern in file-visibility.files
 */
export type FilePatternProps = Pick<
  HiddenFilePatternConfigs["filePath"],
  keyof HiddenFilePatternConfigs["filePath"]
>;

export const TreeFolderCategories = {
  FAVORITES: "favorites",
  EXTENSIONS: "extensions",
  FILES: "files",
  DEFAULT: "default",
};

export type TreeFolderCategories =
  (typeof TreeFolderCategories)[keyof typeof TreeFolderCategories];
