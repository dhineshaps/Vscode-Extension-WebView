import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorld';
import { ExtensionContext, StatusBarAlignment, StatusBarItem, window, workspace } from 'vscode';
import { basename } from 'path';
import * as child_process from 'child_process';
import { cwd, stdout } from 'process';
import { promises } from 'dns';

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

  context.subscriptions.push(
  vscode.commands.registerCommand("fetquest.picktest", async () => {

    const result = await vscode.window.showQuickPick(
      ['one', 'two', 'three'],
      { placeHolder: 'Select one' }
    );

    if (result) {
      vscode.window.showInformationMessage(`You chose ${result}`);
    }
  })
);
}


// This method is called when your extension is deactivated
export function deactivate() {}

function getActiveFilePath(): string | null {

	let gitDirExits : object
	let branchesfunc : Promise<any>

	let path : string
    let uri : vscode.Uri
	const editor: any = window.activeTextEditor;

	var branches : string []
    //var branchesnew

	if (!editor) {
		return null;
	}

	console.log(editor.document.uri)
    console.log(editor.document.uri.fsPath) //it gives c:\Users\Dhinesh\Desktop\repos\fetquest-genai\pages\2_Chatbot.py

	const wsuri = vscode.workspace.getWorkspaceFolder(editor.document.uri)
	console.log("*************")
	console.log(wsuri!.uri.fsPath) //c:\Users\Dhinesh\Desktop\repos\fetquest-genai
	path = wsuri!.uri.fsPath
	uri = vscode.Uri.file(path)
	//vscode.workspace.fs.readDirectory(uri)
	//***********************Commenting out to test ************************* */
	gitDirExits =  readDirectory(uri)
 	console.log("verifying"+ typeof gitDirExits)

	//***********************Commenting out to test ************************* */
	
	async function cp_process(path:string){

		const br : string[] = await childprocess_branch(path);

		return br
	
	}

	async function select_branch(avail_branch : string[]){

			const selected_branch = await showQuickPick(avail_branch)

			return selected_branch

		}

	cp_process(path).then(br => {
	
		// console.log("INSIDE THEN");

		// console.log("this is branches return", br);

		const new_brnc = br.map( bl => bl.trim()).filter(Boolean);

		select_branch(new_brnc).then(sel_br => {
			console.log("the selected branch is....")
			 console.log(sel_br)
			
			})

		// console.log(typeof br)

		// console.log("this is  new branches return", new_brnc);

    });

	

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



function childprocess_branch(path: any) :Promise<any> {
	return new Promise((resolve, reject) => {
	let br : string [] = []
		child_process.exec(`git  -C ${path} branch -a`, (error, stdout, stderr) => { 

		if(error){
			console.log("This is error")
			reject(error);
			return
		}

		if(stdout) {
		//console.log(`stdout: ${stdout}`);

		const tesp = stdout.toString().split(" ")

		//const new_br = tesp.forEach(myFunction)

	    tesp.map( item => {
			if(item.includes("/") && !item.includes("HEAD")){
          
				 if(item.startsWith("origin")){

                    br.push(item.slice(7))
				 } else {
					br.push(item.slice(15))
				 }
		     }
	
	      }
		)
		}

		resolve(br)

	})

	
})
}


async function showQuickPick(avail_branch : string []){
	console.log("inside the quick pick function")
	let i = 0;
	//const result = await window.showQuickPick(['one', 'two', 'three'], {
	const result = await window.showQuickPick(avail_branch, {
		placeHolder: 'Select the target branch to check the latest change',
		//onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
	});

	if(result){
		window.showInformationMessage(`Got: ${result}`);
	} else {
		window.showInformationMessage(`No Branch Selected, Operation Cancelled`);
	}

	return result

}
