import * as vscode from 'vscode';
import { exec } from 'child_process';

export async function listTemplates() {
    const templateContent = await retrieveListTemplates()
    const templateList = vscode.window.showQuickPick(templateContent)

    return templateList
}

async function retrieveListTemplates(): Promise<string[]> {
    const command = 'gh doctemplate list'
    return new Promise<string[]>((resolve, reject) => {
        exec('gh doctemplate list', (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                const filenames = stdout.trim().split('\n')
                const templateNames = filenames.map(filename => filename.slice(0, filename.lastIndexOf('.')))
                resolve(templateNames);
            }
        });
    });
}