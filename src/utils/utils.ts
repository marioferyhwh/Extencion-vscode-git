//utils.ts
import * as vscode from "vscode";
import { exec } from "child_process";

export function runCommand(command: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      console.log("stdout: " + stdout);
      console.log("stderr: " + stderr);
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}
