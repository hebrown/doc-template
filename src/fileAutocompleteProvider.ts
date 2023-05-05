import * as vscode from 'vscode';
import * as fs from 'fs';


export class FileAutocompleteProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Thenable<vscode.CompletionItem[]> {
        const filePaths = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) ?? [];
        const folderPaths = filePaths.filter((path) => fs.statSync(path).isDirectory());
        const fileNames = filePaths.filter((path) => fs.statSync(path).isFile()).map((path) => path.split('/').pop());

        const completionItems = [
            ...folderPaths.map((path) =>
              ({
                label: path.split('/').pop(),
                kind: vscode.CompletionItemKind.Folder
              } as vscode.CompletionItem)
            ),
            ...fileNames.map((fileName) =>
              ({
                label: fileName,
                kind: vscode.CompletionItemKind.File
              } as vscode.CompletionItem)
            )
          ];
          

        return Promise.resolve(completionItems);
    }
}