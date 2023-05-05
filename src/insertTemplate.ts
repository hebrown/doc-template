import * as vscode from 'vscode';
import { exec } from 'child_process';

export async function insertTemplate(template: string){
    const templateContent = await retrieveTemplate(template)
    const snippet = new vscode.SnippetString(templateContent);

    const editor = vscode.window.activeTextEditor;

    if (editor) {
        editor.insertSnippet(snippet);
    }
    
}

async function retrieveTemplate(template:string): Promise<string> {
    const templateFile = template + ".md";
    const command = 'gh doctemplate content ' + templateFile;
    return new Promise<string>((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            reject(error);
        } else {
            resolve(stdout.trim());
        }
        });
    });
}