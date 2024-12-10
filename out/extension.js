"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const todoProvider_1 = require("./todoProvider");
const todoUtils_1 = require("./todoUtils");
function activate(context) {
    // Создаём источник данных для Tree View
    const todoProvider = new todoProvider_1.TodoTreeDataProvider();
    vscode.window.createTreeView('todoView', { treeDataProvider: todoProvider });
    // Команда: обновить список TODO
    context.subscriptions.push(vscode.commands.registerCommand('todo-organizer.refresh', async () => {
        const files = await vscode.workspace.findFiles('**/*.{js,ts,cpp}');
        const allTodos = [];
        for (const file of files) {
            const document = await vscode.workspace.openTextDocument(file);
            const todos = (0, todoUtils_1.findTodosInDocument)(document).map(todo => ({
                file: file.fsPath,
                ...todo
            }));
            allTodos.push(...todos);
        }
        todoProvider.refresh(allTodos);
    }));
    // Команда: перейти к TODO
    context.subscriptions.push(vscode.commands.registerCommand('todo-organizer.goToTodo', ({ file, line }) => {
        const uri = vscode.Uri.file(file);
        vscode.window.showTextDocument(uri).then(editor => {
            const position = new vscode.Position(line - 1, 0);
            editor.revealRange(new vscode.Range(position, position));
        });
    }));
    // Подсветка TODO
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