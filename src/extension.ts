// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getFlashCardItems } from "./utils";

const CMD_ID_SHOW_COUNT = "flash-man-extension.show-count";
let gStatusBar: vscode.StatusBarItem;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const { subscriptions } = context;

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "flash-man-extension" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  subscriptions.push(
    vscode.commands.registerCommand("flash-man-extension.helloWorld", () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from flash-man-extension!"
      );
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand(CMD_ID_SHOW_COUNT, () => {
      const text = vscode.window.activeTextEditor?.document.getText();
      const flashCardItems = getFlashCardItems(text);
      console.log({ flashCardItems });
      vscode.window.showInformationMessage(
        `You have ${flashCardItems.length} flash card items`
      );
    })
  );

  // create a new status bar item that we can now manage
  gStatusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    10000
  );
  gStatusBar.command = CMD_ID_SHOW_COUNT;
  subscriptions.push(gStatusBar);
  subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(updateStatusBar)
  );
  subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(updateStatusBar)
  );

  updateStatusBar();
}

function getNumberOfSelectedLines(editor: vscode.TextEditor | undefined): number {
	let lines = 0;
	if (editor) {
		lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
	}
	return lines;
}

function updateStatusBar() {
  if (vscode.window.activeTextEditor) {
    const { document, selection } = vscode.window.activeTextEditor;
    const text = document.getText(getNumberOfSelectedLines(vscode.window.activeTextEditor) ? selection : undefined);
    const flashCardItems = getFlashCardItems(text);
    const count = flashCardItems.length;
    if (count > 0) {
      gStatusBar.text = `FlashMan: ${count} items`;
      gStatusBar.show();
      return;
    }
  }
  gStatusBar.hide();
}

// This method is called when your extension is deactivated
export function deactivate() {}
