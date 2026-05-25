import { WorkspaceConfiguration, workspace } from "vscode";
import { refresh } from "./commands";
import { rootFolder } from "./utils";

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
 *
 * @param calculateDefaultExclude
 */
export const saveDefaultExclude = (calculateDefaultExclude = true) => {
  if (calculateDefaultExclude) {
    // Get files.exclude array [filePath, boolean]
    const exclude = workspaceFilesConfiguration().get("exclude") as Record<
      string,
      boolean
    >;

    // Get file-visibility.files
    const excluded = getFileVisibilityExcludedFiles();

    // If file-visibility.files includes filePath from files.excluded, then add to defaultExclude
    for (const filePath in exclude) {
      if (excluded.includes(filePath) === false) {
        defaultExclude[filePath] = true;
      }
    }

    // Update files.exclude with files.exclude.... ????
    workspaceFilesConfiguration().update("exclude", exclude);
  } else {
    // Update files.exclude with defaultExclude
    workspaceFilesConfiguration().update("exclude", defaultExclude);
  }
};

/**
 *
 * @returns file-visibility config object in settings.json
 */
export const getFileVisibilityConfig = (): WorkspaceConfiguration => {
  return workspace.getConfiguration("file-visibility");
};

/**
 *
 */
export const updateFilesView = async () => {
  // wait to make sure the files are updated
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Get excluded files from file-visibility.excluded
  const files = getFileVisibilityExcludedFiles();

  // Create new object and add defaultExclude
  const exclude = { ...defaultExclude };

  // Add file:boolean to exclude object
  if (files.length > 0) {
    for (const file of files) {
      exclude[file] = true;
    }
  }

  // Update files.exclude with new object
  workspaceFilesConfiguration().update("exclude", exclude);
};

// Update files-visilibity with files
export const saveExcludeFiles = (files: Array<string>) => {
  getFileVisibilityConfig().update("files", files);
  updateFilesView();
};

// Removes file from files-visibility.files list
export const removeFileFromExcludeList = (relativePath: string) => {
  // Get files-visibility files
  const files = getFileVisibilityExcludedFiles();

  // checks to see if it already exists
  const toIncludeIndex = files.findIndex((file) => file === relativePath);
  if (toIncludeIndex !== -1) {
    files.splice(toIncludeIndex, 1);
  }
  saveExcludeFiles(files);
};

// Add files to exclude list
export const excludeFiles = (paths: Array<string>) => {
  // get existing
  const files = getFileVisibilityExcludedFiles();

  console.log("paths", paths);

  // remove rootFolder string from path
  for (const path of paths) {
    if (path) {
      let cleanFileOrDirPath = path
        .replace(rootFolder + "/", "")
        .replace(rootFolder, "");
      console.log("cleanFileOrDirPath", cleanFileOrDirPath);

      if (files.includes(cleanFileOrDirPath) === false) {
        files.push(cleanFileOrDirPath);
      }
    }
  }
  saveExcludeFiles(files);
};

// Get files from file-visibility.files
export const getFileVisibilityExcludedFiles = (): Array<string> => {
  let files = getFileVisibilityConfig().get("files") as Array<string>;
  if (!files) {
    files = [];
  }

  return files;
};
