import * as vscode from 'vscode';

//Color for TODOs
const todoDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 223, 0, 0.2)',
    border: '1px solid rgba(255, 223, 0, 1)'
});

//Find TODO: in files
export function findTodosInDocument(document: vscode.TextDocument): { line: number; text: string }[] {
    const regex = /(\/\/|#)\s*TODO:(.*)/g;
    const text = document.getText();
    const todos = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        todos.push({ line: document.positionAt(match.index).line + 1, text: match[2].trim() });
    }

    return todos;
}

//Coloring todos
export function highlightTodos(editor: vscode.TextEditor, todos: { line: number; text: string }[]): void {
    const ranges = todos.map(todo => {
        const start = new vscode.Position(todo.line - 1, 0);
        const end = new vscode.Position(todo.line - 1, editor.document.lineAt(todo.line - 1).text.length);
        return { range: new vscode.Range(start, end) };
    });
    editor.setDecorations(todoDecorationType, ranges);
}
