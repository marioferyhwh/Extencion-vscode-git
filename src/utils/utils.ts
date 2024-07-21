//utils.ts
import { exec, spawn } from "child_process";
import { COMMAND_GIT } from "../const/comands";
import { PATTERN } from "../const/pattern";
import { GetPathCommands } from "./Path";
import { logError, logInfo } from "./outputChannel";

export function runCommand(command: string): Promise<string> {
  const cwd = GetPathCommands();
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error);
      } else {
        resolve(stdout);
      }
    });
  });
}

export function runCommandDynamic(commandComplete: string): Promise<string> {
  const cwd = GetPathCommands();
  const [command, ...args] = commandComplete.split(" ");
  return new Promise((resolve, reject) => {
    const executeCommand = spawn(command, args, {
      cwd,
      shell: true,
      detached: true,
    });

    executeCommand.stdout.on("data", (data) => {
      console.log(`stdout:\n${data}`);
    });

    // Manejar los errores estándar
    executeCommand.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    // Manejar los errores de ejecución
    executeCommand.on("message", (message) => {
      console.error(`message: ${message}`);
    });

    // Manejar los errores de ejecución
    executeCommand.on("error", (error) => {
      console.error(`error: ${error.message}`);
    });

    // Manejar el cierre del proceso
    executeCommand.on("close", (code, signal) => {
      if (code === 0) {
        console.log("child process exited successfully");
        resolve("child process exited successfully");
      } else {
        console.error(`child process exited with code ${code} ${signal}`);
        reject(`child process exited with code ${code} ${signal}`);
      }
    });
  });
}

export async function getCurrentBranch(): Promise<string> {
  const branchCurrent = await runCommand(COMMAND_GIT.BRANCH_CURRENT);
  return branchCurrent.trim();
}

export async function DownloaderRemoteBranches() {
  try {
    await runCommandDynamic(COMMAND_GIT.FETCH);
    logInfo(`execute command => ${COMMAND_GIT.FETCH}`);
  } catch (error) {
    logError(`${COMMAND_GIT.FETCH}=>${error}`, true);
    logInfo(`execute manually the command => ${COMMAND_GIT.FETCH}`, true);
  }
}

export async function getListBranches(): Promise<string[]> {
  return (await runCommand(COMMAND_GIT.BRANCH_LIST)).split("\n");
}

export async function isGitClean(): Promise<boolean> {
  const status = await runCommand(COMMAND_GIT.STATUS);
  const findClean = status.search(PATTERN.GIT_CLEAN);
  return findClean !== -1;
}

export async function isGitEnvironment(): Promise<boolean> {
  try {
    const status = await runCommand(COMMAND_GIT.STATUS);
    const findNotRepository = status.search(PATTERN.NOT_GIT_REPOSITORY);
    return findNotRepository === -1;
  } catch (error) {
    console.error(error);
    return false;
  }
}
