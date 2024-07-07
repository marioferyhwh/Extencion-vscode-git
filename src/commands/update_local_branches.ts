//update_local_branches.ts

import * as vscode from "vscode";
import { COMMAND_GIT } from "../const/comands";
import { runCommand } from "../utils/utils";
import { TEXT_CLEAN } from "../const/const";
import { ObjectWithAnyValues } from "../type/ObjectWithAnyValues";
import { logError, logInfo } from "../utils/outputChannel";

const traverseBranches = function (listBranch: ObjectWithAnyValues) {
  for (const [key, element] of Object.entries(listBranch)) {
    if (
      element["LOCAL"] &&
      element["REMOTE"] &&
      element["LOCAL"] !== element["REMOTE"]
    ) {
      console.log(`${key}: ${element}`);
    }
  }
};

export async function UpdateLocalBranches() {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders && workspaceFolders.length > 0) {
    const projectPath = workspaceFolders[0].uri.fsPath;
    logInfo(projectPath);
    try {
      const branchCurrent = await runCommand(
        COMMAND_GIT.BRANCH_CURRENT,
        projectPath
      );

      logInfo("branchCurrent" + branchCurrent);

      let answer = await runCommand(COMMAND_GIT.BRANCH_LIST, projectPath);
      const listBranch = answer.split("\n").reduce((prev: any, value) => {
        if (value === "") {
          return prev;
        }
        const data = value.split(" ");

        const BranchArray =
          data[1].match(/^(refs\/heads\/)(.*)/) ??
          (data[1].match(/^(refs\/remotes\/origin\/)(.*)/) as RegExpMatchArray);

        if ("%(refname)'" === BranchArray[2]) {
          return prev;
        }
        let brach = BranchArray[2];
        let element = prev[brach] ?? {};
        if (BranchArray[1] === "refs/heads/") {
          element["LOCAL"] = data[0];
        } else {
          element["REMOTE"] = data[0];
        }

        prev[brach] = element;

        return prev;
      }, {});
      traverseBranches(listBranch);
      logInfo("listBranch:" + { listBranch });
      /*
      let index = gitStatus.search(TEXT_CLEAN);
      if (index === -1) {
        logInfo("Changes no detected in the git.");
        //return;
      }*/
    } catch (error) {
      logError(`Error: ${error}`);
    }
  } else {
    vscode.window.showErrorMessage("No workspace folder open");
  }
}
