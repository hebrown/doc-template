import {
    CodeLensProvider,
    TextDocument,
    CodeLens,
    Range,
    Command
  } from "vscode";

export class TemplateCodeLens implements CodeLensProvider{
    private regex: RegExp;

    constructor() {
		this.regex = /(.+)/g;
	}

    async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
            // Define where the CodeLens will exist
        let topOfDocument = new Range(0, 0, 0, 0);
        const text = document.getText();
        const contentAdded = text.length > 0;

        // Define what command we want to trigger when activating the CodeLens
        let c: Command = {
        command: "template.insertSnippet",
        title: "Choose a template"
        };

        let codeLens = new CodeLens(topOfDocument, c);

        if(contentAdded){
            return []
        }
        else{
            return [codeLens];
        }
    }

}