//utils.ts
import * as vscode from "vscode";
import { exec } from "child_process";
import { COMMAND_GIT } from "../const/comands";
import { GetPathCommands } from "./Path";

export function runCommand(command: string): Promise<string> {
  const cwd = GetPathCommands();
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

export async function getCurrentBranch(): Promise<string> {
  const branchCurrent = await runCommand(COMMAND_GIT.BRANCH_CURRENT);
  return branchCurrent.trim();
}
