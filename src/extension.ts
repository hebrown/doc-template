// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TemplateCodeLens } from './templateCodeLens';
import { showTemplates } from './showTemplates';
import { addFile } from './addTemplate';
import { deleteSelection, triggerUpdateDecorations } from './textHighlight';
import { insertTemplate } from './insertTemplate';
import { listTemplates } from './listTemplates';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed.
export function activate(context: vscode.ExtensionContext) {

	//Command palette template select
	context.subscriptions.push(
		vscode.commands.registerCommand('template.showTemplates', async () => {
			try{
				const result = await listTemplates();
				if(result){
					showTemplates(result, context);
				}
			} catch (err) {
				vscode.window.showErrorMessage('Error');
			}
		})
	);

	//Submenu options for the context menu
	context.subscriptions.push(
		vscode.commands.registerCommand('template.gettingstarted', (resource: vscode.Uri) =>{
			addFile(resource, "gettingstarted", context);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('template.howto', (resource: vscode.Uri) =>{
			addFile(resource, "howto", context);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('template.faq', (resource: vscode.Uri) =>{
			addFile(resource, "faq", context);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('template.developerguide', (resource: vscode.Uri) =>{
			addFile(resource, "developerguide", context);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('template.contributing', (resource: vscode.Uri) =>{
			addFile(resource, "CONTRIBUTING", context);
		})
	);

	//Codelens prompt to insert snippet
	context.subscriptions.push(
		vscode.commands.registerCommand('template.insertSnippet', async () => {
			try{
				const result = await listTemplates();
				if(result){
					insertTemplate(result);
				}
			} catch (err) {
				vscode.window.showErrorMessage('Error');
			}
		})
	);
	let docSelector = {
		language: "markdown",
		scheme: "file"
	  };
	
	context.subscriptions.push(
		vscode.languages.registerCodeLensProvider(docSelector, new TemplateCodeLens())
	);

	//Mark placeholder text
	let activeEditor = vscode.window.activeTextEditor;

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (activeEditor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	if (activeEditor){
		triggerUpdateDecorations();
	}

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations(true);
		}
	}, null, context.subscriptions);

	vscode.window.onDidChangeTextEditorSelection(event => {
		if (activeEditor && event.textEditor.document === activeEditor.document) {
			setTimeout(() => {
				deleteSelection(event);
			}, 100);
		}
	}, null, context.subscriptions);
}

export function deactivate() {}
