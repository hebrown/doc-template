import * as vscode from 'vscode';

let timeout: NodeJS.Timer | undefined = undefined;

let activeEditor = vscode.window.activeTextEditor;

//Provides style for decorated text
const templateDecorationType = vscode.window.createTextEditorDecorationType({
    fontStyle: 'italic',
    color: 'gray'
});

let decorations: vscode.DecorationOptions[] = [];

//Decorates placeholder text
function updateDecorations() {
    decorations = [];
    if (!activeEditor) {
        return;
    }
    const regEx = /--.*--/g;
    const text = activeEditor.document.getText();
    let match;
    while ((match = regEx.exec(text))) {
        const startPos = activeEditor.document.positionAt(match.index);
        const endPos = activeEditor.document.positionAt(match.index + match[0].length);
        const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Fill in this section with your documentaiton' };
        decorations.push(decoration);
    }
    activeEditor.setDecorations(templateDecorationType, decorations);
}

//Updates decorated text on edit or active editor change
export function triggerUpdateDecorations(throttle = false) {
    activeEditor = vscode.window.activeTextEditor;
    if(activeEditor?.document.languageId !== 'markdown'){
        return;
    }
    if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
    }
    if (throttle) {
        timeout = setTimeout(updateDecorations, 100);
    } else {
        updateDecorations();
    }
}

//Selects entire placeholder text chunk when user clicks anywhere within the chunk
export function deleteSelection(event: vscode.TextEditorSelectionChangeEvent){
    console.log(event.textEditor.document.fileName);
    const selections = event.selections;
    selections.forEach(selection => {
        decorations.forEach(decoration => {
            const decorationRange = decoration.range;
            if ((decorationRange.contains(selection.start) || decorationRange.contains(selection.end)) && activeEditor) {
                const placeholderSelection = new vscode.Selection(decorationRange.start, decorationRange.end);
                activeEditor.selection = placeholderSelection;
            }
        });
    });
}
