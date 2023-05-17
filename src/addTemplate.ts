import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { linkFile } from './linkContributing';

//Uses GH CLI extension to add a new file to the repository
//After file is added, view switches to the newly created file
export async function addFile(resource: vscode.Uri, template: string, context: vscode.ExtensionContext) {
  const templateFile = template + '.md';

  const destinationFolderUri = resource.with({ scheme: 'file' });
  const destinationFolderPath = destinationFolderUri.fsPath;
  const filePath = vscode.Uri.file(destinationFolderPath).fsPath;

  const command = 'gh doctemplate ' + templateFile + ' -o ' + filePath;
  await new Promise<void>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      } else {
        resolve();
      }
    });
  });

  const createdFile = path.join(filePath, templateFile);
  const document = await vscode.workspace.openTextDocument(createdFile);
  vscode.window.showTextDocument(document);
  if(template === "CONTRIBUTING"){
    const newFileTitle = document.lineAt(0).text.trim();
    linkFile(document);
  }
}