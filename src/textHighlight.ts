import * as vscode from 'vscode';

let timeout: NodeJS.Timer | undefined = undefined;

let activeEditor = vscode.window.activeTextEditor;

const smallNumberDecorationType = vscode.window.createTextEditorDecorationType({
    borderWidth: '1px',
    borderStyle: 'solid',
    overviewRulerColor: 'blue',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
    light: {
        // this color will be used in light color themes
        borderColor: 'darkblue'
    },
    dark: {
        // this color will be used in dark color themes
        borderColor: 'lightblue'
    }
});

let decorations: vscode.DecorationOptions[] = [];

export function updateDecorations() {
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
    activeEditor.setDecorations(smallNumberDecorationType, decorations);
}

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

export function deletePlaceHolder(event: vscode.TextDocumentChangeEvent) {
    const changes = event.contentChanges;
    changes.forEach(change => {
        decorations.forEach(decoration => {
            const decorationRange = decoration.range;
            if ((decorationRange.contains(change.range.start) || decorationRange.contains(change.range.end)) && activeEditor) {
                const deleteEnd = decorationRange.end.translate(0, 1);
                const deleteRange = new vscode.Range(decorationRange.start, deleteEnd);
                activeEditor.edit(editBuilder => {
                    editBuilder.delete(deleteRange);
                });
                const removePlaceholder = decorations.indexOf(decoration);
                if(removePlaceholder !== -1){
                    decorations.splice(removePlaceholder, 1);
                }
            }
        });
    });
}
