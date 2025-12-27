import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorld';
import { ExtensionContext, StatusBarAlignment, StatusBarItem, window, workspace } from 'vscode';
import { basename } from 'path';
import * as child_process from 'child_process';
import { cwd } from 'process';

var path = require("path");

//https://code.visualstudio.com/api/references/vscode-api

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "helloworld" is now active!');

	const disposable = vscode.commands.registerCommand('helloworld.helloWorld', () => {

		vscode.window.showInformationMessage('Hey Dhinesh New FET');
	});

	context.subscriptions.push(disposable);

	//fet.askQuestion when this get called the function will be running
	//without using the variable, directly using the subscription
	//in package.json it needs to be added as command so VSCode can recoginize it
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

	context.subscriptions.push(vscode.commands.registerCommand("fetquest.gitDiffPath",() => {

		console.log("here in starting")
	
	   const filePath = getActiveFilePath();

	   if (filePath) {
		console.log("here")
        vscode.window.showInformationMessage(filePath);
      } else{
		vscode.window.showWarningMessage("No active editor found");
	  }

	}))


}


// This method is called when your extension is deactivated
export function deactivate() {}

function getActiveFilePath(): string | null {

	let gitDirExits : object

	let path : string
    let uri : vscode.Uri
	const editor: any = window.activeTextEditor;

	if (!editor) {
		return null;
	}

	// const path1 = editor.document.uri

	// if(path1){
	// 	console.log("path is "+path1)
	// 	return path1
	// }
	console.log(editor.document.uri)
    console.log(editor.document.uri.fsPath) //it gives c:\Users\Dhinesh\Desktop\repos\fetquest-genai\pages\2_Chatbot.py

	const wsuri = vscode.workspace.getWorkspaceFolder(editor.document.uri)
	console.log("*************")
	console.log(wsuri!.uri.fsPath) //c:\Users\Dhinesh\Desktop\repos\fetquest-genai
	path = wsuri!.uri.fsPath
	uri = vscode.Uri.file(path)
	//vscode.workspace.fs.readDirectory(uri)
	gitDirExits =  readDirectory(uri)
	console.log("verifying"+ typeof gitDirExits)
	
	child_process.exec(`git  -C ${path} branch -a`, (error, stdout, stderr) => { 
		if(error){
			console.log("This is error")
		}
		console.log(`stdout: ${stdout}`);
  		console.error(`stderr: ${stderr}`);
	})

	

	// console.log(typeof wsuri?.uri.fsPath) //gives string
	// console.log("************************")
	// console.log(wsuri!.uri) //object
	// console.log("************************")
	// const new_uri : vscode.Uri =  wsuri!.uri 
	// const filesRead = vscode.workspace.fs.readDirectory(editor.document.uri)
	// const rootPath_new = vscode.workspace.rootPath
	// let uri : vscode.Uri = vscode.Uri.file(rootPath_new);
	// const filesRead1 = vscode.workspace.fs.readDirectory(uri1)
	// console.log(filesRead1)

	// const gitDirExits = vscode.FileSystemError.FileExists(wsuri?.uri)
	// console.log(gitDirExits.toString())
	// //console.log(editor.document.uri.fsPath+'/.git')
	// console.log(vscode.FileSystemError.FileExists(gitDirExits.name))
	// console.log("test new")
	return editor.document.uri.fsPath
}


async function readDirectory(folderPath: vscode.Uri) {
  try {
    const files = await vscode.workspace.fs.readDirectory(folderPath);
    // files is an array of filenames (strings)
    for (const file of files) {
      console.log(file[0]);

	  if(file[0] === ".git"){
		console.log(".git ffound this is git directory")

		return true
	  } else {
		return false
	  }
	  
	  
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}