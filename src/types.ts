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

/**
 *  Type for properties stored per pattern in file-visibility.files
 */
// export type FileConfigs = Pick<
//   ExtSettingConfigs["filePath"],
//   keyof ExtSettingConfigs["filePath"]
// >;

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
