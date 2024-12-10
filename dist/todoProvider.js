"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoTreeDataProvider = void 0;
const vscode = require("vscode");
class TodoItem extends vscode.TreeItem {
    constructor(label, collapsibleState, filePath, lineNumber) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        if (filePath && lineNumber !== undefined) {
            this.command = {
                command: 'todo-organizer.goToTodo',
                title: 'Перейти к TODO',
                arguments: [{ file: filePath, line: lineNumber }]
            };
        }
    }
}
class TodoTreeDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.todos = [];
    }
    refresh(newTodos) {
        this.todos = newTodos;
        this._onDidChangeTreeData.fire();
    }
    getChildren(element) {
        if (!element) {
            const files = Array.from(new Set(this.todos.map(todo => todo.file)));
            return files.map(file => new TodoItem(file, vscode.TreeItemCollapsibleState.Collapsed));
        }
        else {
            return this.todos
                .filter(todo => todo.file === element.label)
                .map(todo => new TodoItem(`TODO: ${todo.text}`, vscode.TreeItemCollapsibleState.None, todo.file, todo.line));
        }
    }
    getTreeItem(element) {
        return element;
    }
}
exports.TodoTreeDataProvider = TodoTreeDataProvider;
//# sourceMappingURL=todoProvider.js.map