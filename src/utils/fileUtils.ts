import {
  workspace,
  window,
  OutputChannel,
  ExtensionContext,
  RelativePattern,
} from "vscode";
import * as vscode from "vscode";
import * as fs from "fs";
import { HiddenFilesProvider } from "../HiddenFilesProvider";
import { refresh, registerCommands } from "../commands";
import {
  getFileVisibilityFileConfigs,
  saveDefaultExclude,
  saveExcludeFiles,
} from "./configUtils";

import * as config from "../../config.json";

export let hiddenFilesProvider: HiddenFilesProvider;
export const rootFolder = workspace.workspaceFolders?.[0].uri.path as string;

export const exists = (path: string) => {
  return fs.existsSync(path);
};
export const isDirectory = (path: string) => {
  return fs.statSync(path).isDirectory();
};

export const resetSettings = (fullReset = true) => {
  saveDefaultExclude(fullReset);

  const excludedFiles = getFileVisibilityFileConfigs();
  if (Object.keys(excludedFiles).length === 0) {
    saveExcludeFiles({});
  }
};

export const init = (context: ExtensionContext) => {
  hiddenFilesProvider = new HiddenFilesProvider();
  registerCommands(context);

  resetSettings();

  workspace.onDidDeleteFiles((e) => {
    let shouldReset = false;
    for (const { path } of e.files) {
      if (
        path.endsWith(".vscode/settings.json") ||
        path.endsWith(".vscode/") ||
        path.endsWith(".vscode")
      ) {
        shouldReset = true;
        const selection = vscode.window.showWarningMessage(
          `The .vscode directory and settings.json are needed for the ${config.EXT_ID} extension. 
           The .vscode/settings.json will be created again. You'll need to disable the extension to stop this from happening.
           
           Consider adding .vscode to your .gitignore (or hiding it) if you wish to continue using the extension as an alternative. 
          `,
          { modal: true }, // Forces a true center-screen confirmation popup
          "OK", // Button 1
        );
        break;
      }
    }

    setTimeout(() => {
      if (shouldReset) {
        resetSettings(false);
      }

      refresh();
    }, 1000);
  });
};

export const getFileExtension = (filePath: string) => {
  return filePath.slice(
    (Math.max(0, filePath.lastIndexOf(".")) || Infinity) + 1,
  );
};

export const shortenFilePath = (filePath: string, elements: number) => {
  const parts = filePath.split(/[/\\]/);
  const shortenedPath = parts.slice(-elements);

  return shortenedPath.join("/");
};
