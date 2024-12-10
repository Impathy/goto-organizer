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
exports.TodoTreeDataProvider = void 0;
const vscode = __importStar(require("vscode"));
class TodoItem extends vscode.TreeItem {
    label;
    collapsibleState;
    filePath;
    lineNumber;
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
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    todos = [];
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