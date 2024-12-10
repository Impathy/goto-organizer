"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = require("vscode");
const todoProvider_1 = require("./todoProvider");
const todoUtils_1 = require("./todoUtils");
function activate(context) {
    const todoProvider = new todoProvider_1.TodoTreeDataProvider();
    vscode.window.createTreeView('todoView', { treeDataProvider: todoProvider });
    context.subscriptions.push(vscode.commands.registerCommand('todo-organizer.refresh', () => __awaiter(this, void 0, void 0, function* () {
        const files = yield vscode.workspace.findFiles('**/*.{js,ts,cpp}');
        const allTodos = [];
        for (const file of files) {
            const document = yield vscode.workspace.openTextDocument(file);
            const todos = (0, todoUtils_1.findTodosInDocument)(document).map(todo => (Object.assign({ file: file.fsPath }, todo)));
            allTodos.push(...todos);
        }
        todoProvider.refresh(allTodos);
    })));
    context.subscriptions.push(vscode.commands.registerCommand('todo-organizer.goToTodo', ({ file, line }) => {
        const uri = vscode.Uri.file(file);
        vscode.window.showTextDocument(uri).then(editor => {
            const position = new vscode.Position(line - 1, 0);
            editor.revealRange(new vscode.Range(position, position));
        });
    }));
    // Add coloring for TODO
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            const todos = (0, todoUtils_1.findTodosInDocument)(editor.document);
            (0, todoUtils_1.highlightTodos)(editor, todos);
        }
    });
    vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document === event.document) {
            const todos = (0, todoUtils_1.findTodosInDocument)(editor.document);
            (0, todoUtils_1.highlightTodos)(editor, todos);
        }
    });
}
//# sourceMappingURL=extension.js.map