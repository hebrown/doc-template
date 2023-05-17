import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let fileToLink: vscode.TextDocument;

export function linkFile(newDocument: vscode.TextDocument){
    const fileName = 'README.md';
    fileToLink = newDocument;
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        for (const folder of workspaceFolders) {
            const filePath = `${folder.uri.fsPath}/${fileName}`;
            if (fs.existsSync(filePath)) {
                addLink(filePath);
            }
        }
    }
    return false;
}

async function addLink(filePath: string){
    const workspaceEdit = new vscode.WorkspaceEdit();
    try {
        const document: vscode.TextDocument = await vscode.workspace.openTextDocument(filePath);

        const content = constructLink(document.uri);
        const endPosition = document.lineAt(document.lineCount - 1).range.end;
        const endOfLine = document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n';
        const newText = `${endOfLine}${content}${endOfLine}`;
        workspaceEdit.insert(document.uri, endPosition, newText);
        vscode.workspace.applyEdit(workspaceEdit);
      } catch (error) {
        console.error(`Error linking document: ${error}`);
        return undefined;
      }
}

function constructLink(filePath: vscode.Uri){
    const editPath = filePath.fsPath;
    const linkPath = fileToLink.uri.fsPath;
    const relativePath = path.relative(editPath, linkPath);
    const normalizedPath = relativePath.startsWith('..') ? relativePath.substring(2) : relativePath;
    
    const newFileTitle = fileToLink.lineAt(0).text.trim();

    const newFileName = newFileTitle.replace(/#/g, '').trim();

    const content = `${newFileTitle}\n[${newFileName}](${normalizedPath})`;
    
    return content;
}