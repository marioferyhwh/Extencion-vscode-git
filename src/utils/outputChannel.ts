// outputChannel.ts
import * as vscode from "vscode";

const outputChannel = vscode.window.createOutputChannel("Git Tools");

export function logInfo(message: string): void {
  outputChannel.appendLine(`INFO: ${message}`);
}
export function logError(error: string): void {
  outputChannel.appendLine(`ERROR: ${error}`);
}
