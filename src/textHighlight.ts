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

export function updateDecorations() {
    if (!activeEditor) {
        return;
    }
    const regEx = /--.*--/g;
    const text = activeEditor.document.getText();
    const smallNumbers: vscode.DecorationOptions[] = [];
    const largeNumbers: vscode.DecorationOptions[] = [];
    let match;
    while ((match = regEx.exec(text))) {
        const startPos = activeEditor.document.positionAt(match.index);
        const endPos = activeEditor.document.positionAt(match.index + match[0].length);
        const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
        smallNumbers.push(decoration);
    }
    activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);
}

export function triggerUpdateDecorations(throttle = false) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
    }
    if (throttle) {
        console.log("throttle");
        timeout = setTimeout(updateDecorations, 500);
    } else {
        updateDecorations();
    }
}