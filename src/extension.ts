//extensions.ts
import * as vscode from "vscode";
import { UpdateLocalBranches } from "./commands/update_local_branches";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Git Tools");
  const EXTENSIONS_NAME = "tool-git";
  const COMMAND_HELLO_WORD = EXTENSIONS_NAME + ".helloWorld";
  const COMMAND_UPDATE_LOCAL_BRANCHES =
    EXTENSIONS_NAME + ".updateLocalBranches";

  console.log('Congratulations, your extension "tool-git" is now active!');

  const disposable = vscode.commands.registerCommand(COMMAND_HELLO_WORD, () => {
    outputChannel.appendLine("gitLog");
    vscode.window.showInformationMessage("Hello World from tool-git!");
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_UPDATE_LOCAL_BRANCHES, async () => {
      await UpdateLocalBranches(outputChannel);
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
