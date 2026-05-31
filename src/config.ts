import { WorkspaceConfiguration, workspace } from "vscode";
import { refresh } from "./commands";
import { rootFolder } from "./utils";
import { ExcludedFiles } from "./types";
import { FILE_VISIBILITY } from "./constants";
import * as vscode from "vscode";
import * as config from "../config.json";

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
export const saveDefaultExclude = async (calculateDefaultExclude = true) => {
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
export const updateFilesView = async (files: ExcludedFiles) => {
  // Create new object and add defaultExclude
  const newExcludedFiles = { ...defaultExclude, ...files };
  await workspaceFilesConfiguration().update(
    "exclude",
    newExcludedFiles,
    vscode.ConfigurationTarget.Workspace,
  );
};

// Update files-visilibity with files
export const saveExcludeFiles = async (files: ExcludedFiles) => {
  await getFileVisibilityConfig().update(
    "files",
    files,
    vscode.ConfigurationTarget.Workspace,
  );
  await updateFilesView(files);
};

// Removes file from files-visibility.files list
export const removeFileFromExcludeList = (relativePath: string) => {
  // Get files-visibility files. Need to spread otherwise will error.
  const files = { ...getFileVisibilityExcludedFiles() };
  delete files[relativePath];

  saveExcludeFiles(files);
};

// Add files to exclude list
export const addFilesToExcluded = (paths: Array<string>) => {
  // get existing
  const files = { ...getFileVisibilityExcludedFiles() };

  // files = {'index.ts': true, 'package.json': true}

  // remove rootFolder string from path
  for (const path of paths) {
    if (path) {
      let cleanFileOrDirPath = path
        .replace(rootFolder + "/", "")
        .replace(rootFolder, "");

      if (!Object.hasOwn(files, path)) {
        files[cleanFileOrDirPath] = true;
      }
    }
  }
  saveExcludeFiles(files);
};

// Get files from file-visibility.files
export const getFileVisibilityExcludedFiles = (): Record<string, boolean> => {
  const files = getFileVisibilityConfig().get<Record<string, boolean>>(
    "files",
    {},
  );
  return files;
};
