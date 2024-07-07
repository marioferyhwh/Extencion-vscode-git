//update_local_branches.ts

import * as vscode from "vscode";
import { COMMAND_GIT } from "../const/comands";
import { ObjectWithAnyValues } from "../type/ObjectWithAnyValues";
import { logError, logInfo, logWarning } from "../utils/outputChannel";
import { SetPathCommands } from "../utils/Path";
import {
  DownloaderRemoteBranches,
  getCurrentBranch,
  getListBranches,
  runCommand,
} from "../utils/utils";

const LOCAL = "LOCAL";
const REMOTE = "REMOTE";

const branchOutDateTobranchBase = async function (
  branch: string,
  branchBase: string
): Promise<boolean> {
  const listBranch = (
    await runCommand(COMMAND_GIT.LOG_BRANCH + " -n 100 " + branchBase)
  )
    .replace("HEAD ->", "")
    .split("\n");
  return (
    listBranch.findIndex(
      (x) => x.split(",").findIndex((y) => y.trim() === branch) !== -1
    ) !== -1
  );
};

const UpdateCurrentBranch = async function (branch: string, brachBase: string) {
  logInfo("Updating current branch");
  await runCommand(
    COMMAND_GIT.BRACH_CURRENT_UPDATE_FORCE.replace(
      /\$\{branch\_base\}/,
      brachBase
    )
  );
  logInfo(`Current branch "${branch}" updated successfully`);
};
const updateOutdatedBranches = async function (
  branch: string,
  branchBase: string
) {
  logInfo(`Updating outdated branch "${branch}" to "${branchBase}"`);

  await runCommand(
    COMMAND_GIT.BRACH_UPDATE_FORCE.replace(/\$\{branch\}/, branch).replace(
      /\$\{branch\_base\}/,
      branchBase
    )
  );

  logInfo(`Outdated branch "${branch}" updated successfully`);
};

const traverseBranches = async function (listBranch: ObjectWithAnyValues) {
  const currentBranch = await getCurrentBranch();
  for (const [branch, element] of Object.entries(listBranch)) {
    if (!element[LOCAL]) {
      logInfo(`Local branch "${branch}" not found`);
      continue;
    }
    if (!element[REMOTE]) {
      logInfo(`Remote branch "${branch}" not found`);
      continue;
    }
    if (element[LOCAL] === element[REMOTE]) {
      logInfo(`Branch "${branch}" is already up to date`);
      continue;
    }

    const branchRemote = `origin/${branch}`;
    const isBranchOutDate = await branchOutDateTobranchBase(
      branch,
      branchRemote
    );
    if (!isBranchOutDate) {
      const isBranchBaseOutDate = await branchOutDateTobranchBase(
        branchRemote,
        branch
      );
      if (isBranchBaseOutDate) {
        logWarning(
          `Remote branch "${branchRemote}" has changes that need to be pushed`,
          true
        );
      } else {
        logWarning(`Manual review needed for branch "${branch}"`, true);
      }
      continue;
    }

    logInfo(`Updating branch "${branch}"`);
    if (branch === currentBranch) {
      await UpdateCurrentBranch(branch, branchRemote);
    } else {
      await updateOutdatedBranches(branch, branchRemote);
    }
  }
};

export async function UpdateLocalBranches() {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders && workspaceFolders.length > 0) {
    const projectPath = workspaceFolders[0].uri.fsPath;
    SetPathCommands(projectPath);
    try {
      await DownloaderRemoteBranches();
      let answer = await getListBranches();
      const listBranch = answer.reduce((prev: any, value) => {
        if (value === "") {
          return prev;
        }
        const data = value.split(" ");

        const BranchArray =
          data[1].match(/^(refs\/heads\/)(.*)/) ??
          (data[1].match(/^(refs\/remotes\/origin\/)(.*)/) as RegExpMatchArray);

        let brach = BranchArray[2];
        let element = prev[brach] ?? {};
        if (BranchArray[1] === "refs/heads/") {
          element[LOCAL] = data[0];
        } else {
          element[REMOTE] = data[0];
        }

        prev[brach] = element;

        return prev;
      }, {});
      await traverseBranches(listBranch);

      logInfo("Branch processed successfully", true);
    } catch (error) {
      logError(`${error}`);
    }
  } else {
    logError("No workspace folder open", true);
  }
}
