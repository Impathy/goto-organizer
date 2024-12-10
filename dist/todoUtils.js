"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTodosInDocument = findTodosInDocument;
exports.highlightTodos = highlightTodos;
const vscode = require("vscode");
const todoDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 223, 0, 0.2)',
    border: '1px solid rgba(255, 223, 0, 1)'
});
function findTodosInDocument(document) {
    const regex = /(\/\/|#)\s*TODO:(.*)/g;
    const text = document.getText();
    const todos = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        todos.push({ line: document.positionAt(match.index).line + 1, text: match[2].trim() });
    }
    return todos;
}
function highlightTodos(editor, todos) {
    const ranges = todos.map(todo => {
        const start = new vscode.Position(todo.line - 1, 0);
        const end = new vscode.Position(todo.line - 1, editor.document.lineAt(todo.line - 1).text.length);
        return { range: new vscode.Range(start, end) };
    });
    editor.setDecorations(todoDecorationType, ranges);
}
//# sourceMappingURL=todoUtils.js.map