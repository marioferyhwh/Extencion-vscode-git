// outputChannel.ts
import * as vscode from "vscode";

const outputChannel = vscode.window.createOutputChannel("Git Tools");

export function logInfo(message: string, showMessage = false): void {
  outputChannel.appendLine(`INFO: ${message}`);
  if (showMessage) {
    vscode.window.showInformationMessage(`INFO: ${message}`);
  }
}

export function logWarning(warning: string, showMessage = false): void {
  outputChannel.appendLine(`WARNING: ${warning}`);
  if (showMessage) {
    vscode.window.showWarningMessage(`WARNING: ${warning}`);
  }
}
export function logError(error: string, showMessage = false): void {
  outputChannel.appendLine(`ERROR: ${error}`);
  if (showMessage) {
    vscode.window.showErrorMessage(`ERROR: ${error}`);
  }
}

export function logStatus(message: string, showMessage = false): void {
  outputChannel.appendLine(`STATUS: ${message}`);
  if (showMessage) {
    vscode.window.setStatusBarMessage(`STATUS: ${message}`, 5000);
  }
}
