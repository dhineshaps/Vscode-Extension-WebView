import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorld';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "helloworld" is now active!');

	const disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {

		vscode.window.showInformationMessage('Hey Dhinesh New FET');
	});

	context.subscriptions.push(disposable);

	//fet.askQuestion when this get called the function will be running
	//without using the variable, directly using the subscription
	//in extsension.js it needs to be added as command so VSCode can recoginize it
	//fetquest is the group, so by searching it all the commands can be visble
	context.subscriptions.push(vscode.commands.registerCommand("fet.askQuestion", async() => {

		const answer = await vscode.window.showInformationMessage('How is your day?','good','bad');

		if (answer == "bad") {
			vscode.window.showInformationMessage('Sad to hear it is bad');
		} else if  (answer == "good") {
			vscode.window.showInformationMessage('Glad to hear it');
		} else {
			vscode.window.showInformationMessage('Wishing you the great day ahead');
		}

	}))

	context.subscriptions.push(vscode.commands.registerCommand("fetquest.greetings",() => {

		vscode.window.showInformationMessage('Hey Hello?');

	}))

	context.subscriptions.push(vscode.commands.registerCommand("fetquest.hellopanel",() => {
	
	   HelloWorldPanel.createOrShow(context.extensionUri)

	}))

}

// This method is called when your extension is deactivated
export function deactivate() {}
