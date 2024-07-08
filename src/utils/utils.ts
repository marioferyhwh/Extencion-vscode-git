//utils.ts
import { exec } from "child_process";
import { COMMAND_GIT } from "../const/comands";
import { PATTERN } from "../const/pattern";
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

export async function DownloaderRemoteBranches() {
  console.log("fetch");
  await runCommand(COMMAND_GIT.FETCH);
}

export async function getListBranches(): Promise<string[]> {
  return (await runCommand(COMMAND_GIT.BRANCH_LIST)).split("\n");
}

export async function isGitClean(): Promise<boolean> {
  const status = await runCommand(COMMAND_GIT.STATUS);
  const findClean = status.search(PATTERN.GIT_CLEAN);
  return findClean !== -1;
}
