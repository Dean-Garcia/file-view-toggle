import { WorkspaceConfiguration, workspace } from "vscode";
import { rootFolder, shortenFilePath } from "./fileUtils";
import {
  ExtSettingConfigs,
  FileConfigs,
  PatternRules,
  TreeFolderCategories,
  FilePatternKeys,
} from "../types";
import * as vscode from "vscode";
import * as config from "../../config.json";
import { HiddenFileTreeItem } from "../HiddenFileTreeItem";
import { TreeFolderItem } from "../TreeFolderItem";
import { refresh } from "../commands";

const defaultExclude: Record<string, boolean> = {};

/**
 * @returns workspace config for 'files'
 */
export const workspaceFilesConfiguration = (): WorkspaceConfiguration => {
  return workspace.getConfiguration(
    "files",
    workspace.workspaceFolders?.[0].uri,
  );
};

/**
 * @returns workspace config for 'files'
 */
export const workspaceSearchConfiguration = (): WorkspaceConfiguration => {
  return workspace.getConfiguration(
    "search",
    workspace.workspaceFolders?.[0].uri,
  );
};

/**
 *
 * @param calculateDefaultExclude
 */
export const saveDefaultExclude = async (calculateDefaultExclude = true) => {
  if (calculateDefaultExclude) {
    // Get files.exclude array [filePath, boolean]
    const exclude = workspaceFilesConfiguration().get("exclude") as Record<
      string,
      boolean
    >;

    // Get file-visibility.files
    const excluded = { ...getFileVisibilityFileConfigs() };

    // If file-visibility.files includes filePath from files.excluded, then add to defaultExclude
    for (const filePath in exclude) {
      if (!Object.hasOwn(excluded, filePath)) {
        defaultExclude[filePath] = true;
      }
    }

    // Update files.exclude with files.exclude.... ????
    await workspaceFilesConfiguration().update(
      "exclude",
      exclude,
      vscode.ConfigurationTarget.Workspace,
    );
  } else {
    // Update files.exclude with defaultExclude
    await workspaceFilesConfiguration().update(
      "exclude",
      defaultExclude,
      vscode.ConfigurationTarget.Workspace,
    );
  }
};

/**
 *
 * @returns file-visibility config object in settings.json
 */
export const getFileVisibilityConfig = (): WorkspaceConfiguration => {
  return workspace.getConfiguration(config.VIEW_ID);
};

/**
 *
 */
export const updateFilesView = async (files: Record<string, FileConfigs>) => {
  // Create new object and add defaultExclude
  const fileExcludeObj: PatternRules = {};
  Object.entries(files).map(([path, props]) => {
    fileExcludeObj[path] = props.isHidden;
  });
  const newExcludedFiles: PatternRules = {
    ...defaultExclude,
    ...fileExcludeObj,
  };
  await workspaceFilesConfiguration().update(
    "exclude",
    newExcludedFiles,
    vscode.ConfigurationTarget.Workspace,
  );

  const searchExcludeObj: PatternRules = {};
  Object.entries(files).map(([path, props]) => {
    searchExcludeObj[path] = props.isNotSearchable;
  });

  await workspaceSearchConfiguration().update(
    "exclude",
    searchExcludeObj,
    vscode.ConfigurationTarget.Workspace,
  );
};

// Update files-visilibity with files
export const saveExcludeFiles = async (files: Record<string, FileConfigs>) => {
  await getFileVisibilityConfig().update(
    "files",
    files,
    vscode.ConfigurationTarget.Workspace,
  );
  await updateFilesView(files);
};

// Removes file from files-visibility.files list
export const removeFilesFromExcludeList = async (
  items: HiddenFileTreeItem[],
) => {
  // Get files-visibility files. Need to spread otherwise will error.
  const files = { ...getFileVisibilityFileConfigs() };
  for (const item of items) {
    delete files[item.label];
  }

  await saveExcludeFiles(files);
};

// Add files to exclude list
export const addFilesToExcluded = async (
  paths: Array<string>,
  category?: TreeFolderCategories,
) => {
  // get existing
  const files = { ...getFileVisibilityFileConfigs() };

  // files = {'index.ts': true, 'package.json': true}

  // remove rootFolder string from path
  for (const path of paths) {
    if (path) {
      let cleanFileOrDirPath = path
        .replace(rootFolder + "/", "")
        .replace(rootFolder, "");

      if (!Object.hasOwn(files, path)) {
        const props = getDefaultConfigs(cleanFileOrDirPath, category);
        files[cleanFileOrDirPath] = props;
      }
    }
  }
  await saveExcludeFiles(files);
};

export const toggleAllFilesVisibility = async (hideOrShow: "hide" | "show") => {
  const files = { ...getFileVisibilityFileConfigs() };
  // const toggledFiles: Record<string, FileConfigs> = {};

  const wantToHide = hideOrShow === "hide";

  Object.entries(files).forEach(([file, props]) => {
    if (!props.isLocked) {
      files[file].isHidden = wantToHide;
    }
  });

  await saveExcludeFiles(files);
  refresh();
};

export const togglePropertyForFiles = async (
  item: HiddenFileTreeItem | TreeFolderItem,
  allSelectedItems: Array<HiddenFileTreeItem | TreeFolderItem>,
  property: FilePatternKeys,
) => {
  const filesToProcess = allSelectedItems || [item];
  const fileObject = { ...getFileVisibilityFileConfigs() };

  for (const item of filesToProcess) {
    if (
      !(item instanceof TreeFolderItem) &&
      fileObject[item.label][property] !== undefined
    ) {
      fileObject[item.label][property] = !fileObject[item.label][property];
    }
  }
  await saveExcludeFiles(fileObject);
  refresh();
};

export const toggleFolderProperty = async (
  item: TreeFolderItem,
  property: FilePatternKeys,
  desiredValue: boolean,
) => {
  const files = { ...getFileVisibilityFileConfigs() };
  const category = item.id;
  Object.entries(files).forEach(([file, props]) => {
    if (props.isFavorite && category === TreeFolderCategories.FAVORITES) {
      files[file][property] = desiredValue;
    } else if (!props.isFavorite && props.treeViewFolder === category) {
      files[file][property] = desiredValue;
    }
  });

  await saveExcludeFiles(files);
  refresh();
};

// Get files from file-visibility.files
export const getFileVisibilityFileConfigs = (): ExtSettingConfigs => {
  const files = getFileVisibilityConfig().get<ExtSettingConfigs>("files", {});
  const sanitizedFileConfigs: ExtSettingConfigs = {};

  // Need to sanitize props object to be able to read from it
  // Returns a Proxy (object) otherwise, leading to errors when reading things like files[path].isHidden
  Object.entries(files).map(([file, props]) => {
    sanitizedFileConfigs[file] = Object.assign({}, props);
  });
  return sanitizedFileConfigs;
};

export const getFileVisibilityPatterns = (
  property: keyof FileConfigs,
): Record<string, boolean | string> => {
  const files = { ...getFileVisibilityFileConfigs() };
  const fileVisibilityPatterns: Record<string, boolean | string> = {};

  Object.entries(files).forEach(([file, props]) => {
    fileVisibilityPatterns[file] = props[property];
  });

  return fileVisibilityPatterns;
};

export const getDefaultConfigs = (
  path: string,
  category = TreeFolderCategories.FILES,
) => {
  const shortPathString = shortenFilePath(path, 2);

  return {
    shortenedPath: shortPathString,
    treeViewFolder: category,
    isHidden: true,
    isNotSearchable: false,
    isLocked: false,
    isFavorite: false,
  };
};
