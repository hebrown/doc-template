import * as vscode from 'vscode';

import { addFile } from './addTemplate';

//Prompt for selecting destination folder after a template is chosen from the command palette
export async function showTemplates(template: string, context: vscode.ExtensionContext) {
    
	try {
        const destinationPath = await vscode.window.showInputBox({
            prompt: 'Enter the destination path for the new file:',
            value: '',
            placeHolder: 'Enter a destination path...',
        });

        const editor = vscode.window.activeTextEditor;
        if(editor){
            const currentPath = editor.document.uri
            let destLocation;
            if(destinationPath){
                destLocation = vscode.Uri.joinPath(currentPath, '../', destinationPath)
            }
            else{
                destLocation = vscode.Uri.joinPath(currentPath, '../')
            }
            addFile(destLocation, template, context);
        }
            
    } catch (err) {
        vscode.window.showErrorMessage(`Error: ${err}`);
    }

};