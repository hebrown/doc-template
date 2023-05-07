import * as vscode from 'vscode';

export function findPlaceholderRanges(text: string, regex: RegExp): vscode.Range[] {
    const ranges: vscode.Range[] = [];
    let match;
  
    while (match = regex.exec(text)) {
      const start = match.index + 2;
      const end = match.index + match[0].length - 2;
  
      ranges.push(new vscode.Range(new vscode.Position(0, start), new vscode.Position(0, end)));
    }
  
    return ranges;
  }
  
export function deletePlaceholderTextIfMatched(textEditor: vscode.TextEditor, newPosition: vscode.Position, newText: string, placeholderRegex: RegExp): void {
    const placeholderMatch = newText.match(placeholderRegex);
    console.log(placeholderMatch);
  
    if (placeholderMatch) {
        console.log("hello from delete match");
      const range = textEditor.document.getWordRangeAtPosition(newPosition, placeholderRegex) as vscode.Selection;
      const placeholder = textEditor.document.getText(range);
  
      if (placeholder === placeholderMatch[0]) {
        textEditor.edit(editBuilder => {
          editBuilder.delete(range);
        });
  
        textEditor.selection = new vscode.Selection(newPosition, newPosition);
      }
    }
}