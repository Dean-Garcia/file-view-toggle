import { WorkspaceConfiguration, workspace } from "vscode";
import { rootFolder, shortenFilePath } from "./fileUtils";
import {
  HiddenFilePatternConfigs,
  FilePatternProps,
  PatternRules,
} from "../types";
import * as vscode from "vscode";
import * as config from "../../config.json";
import { HiddenFileTreeItem } from "../HiddenFileTreeItem";

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
export const updateFilesView = async (
  files: Record<string, FilePatternProps>,
) => {
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
export const saveExcludeFiles = async (
  files: Record<string, FilePatternProps>,
) => {
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
export const addFilesToExcluded = async (paths: Array<string>) => {
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
        const props = getDefaultConfigs(cleanFileOrDirPath);
        files[cleanFileOrDirPath] = props;
      }
    }
  }
  await saveExcludeFiles(files);
};

export const toggleAllFilesVisibility = async (hideOrShow: "hide" | "show") => {
  const files = { ...getFileVisibilityFileConfigs() };
  const toggledFiles: Record<string, FilePatternProps> = {};

  const wantToHide = hideOrShow === "hide";

  Object.entries(files).forEach(([file, props]) => {
    toggledFiles[file] = { ...props, isHidden: wantToHide };
  });

  await saveExcludeFiles(toggledFiles);
};

// Get files from file-visibility.files
export const getFileVisibilityFileConfigs = (): HiddenFilePatternConfigs => {
  const files = getFileVisibilityConfig().get<HiddenFilePatternConfigs>(
    "files",
    {},
  );
  const sanitizedFileConfigs: HiddenFilePatternConfigs = {};

  // Need to sanitize props object to be able to read from it
  // Returns a Proxy (object) otherwise, leading to errors when reading things like files[path].isHidden
  Object.entries(files).map(([file, props]) => {
    sanitizedFileConfigs[file] = Object.assign({}, props);
  });
  return sanitizedFileConfigs;
};

export const getFileVisibilityPatterns = (
  property: keyof FilePatternProps,
): Record<string, boolean | string> => {
  const files = { ...getFileVisibilityFileConfigs() };
  const fileVisibilityPatterns: Record<string, boolean | string> = {};

  Object.entries(files).forEach(([file, props]) => {
    fileVisibilityPatterns[file] = props[property];
  });

  return fileVisibilityPatterns;
};

export const getDefaultConfigs = (path: string) => {
  const shortPathString = shortenFilePath(path, 2);

  return {
    shortenedPath: shortPathString,
    isHidden: true,
    isNotSearchable: false,
    isFavorite: false,
    isLocked: false,
  };
};
