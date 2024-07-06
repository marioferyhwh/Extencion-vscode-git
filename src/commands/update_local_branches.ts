//update_local_branches.ts

import * as vscode from "vscode";
import { GIT_LOG_1 } from "../const/comands";
import { runCommand } from "../utils/utils";

export async function UpdateLocalBranches(outputChannel: any) {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders && workspaceFolders.length > 0) {
    const projectPath = workspaceFolders[0].uri.fsPath;
    outputChannel.appendLine(projectPath);
    try {
      const gitLog = await runCommand(GIT_LOG_1, projectPath);
      outputChannel.appendLine(gitLog);
    } catch (error) {
      outputChannel.appendLine(`Error: ${error}`);
    }
  } else {
    vscode.window.showErrorMessage("No workspace folder open");
  }
}
