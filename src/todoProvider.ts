import * as vscode from 'vscode';

//make class for Tree Viev
class TodoItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly filePath?: string,
        public readonly lineNumber?: number
    ) {
        super(label, collapsibleState);
        if (filePath && lineNumber !== undefined) {
            this.command = {
                command: 'todo-organizer.goToTodo',
                title: 'Перейти к TODO',
                arguments: [{ file: filePath, line: lineNumber }]
            };
        }
    }
}


export class TodoTreeDataProvider implements vscode.TreeDataProvider<TodoItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TodoItem | undefined | void> = new vscode.EventEmitter();
    readonly onDidChangeTreeData: vscode.Event<TodoItem | undefined | void> = this._onDidChangeTreeData.event;

    private todos: { file: string; line: number; text: string }[] = [];

    //Function to refresh tree
    refresh(newTodos: { file: string; line: number; text: string }[]): void {
        this.todos = newTodos;
        this._onDidChangeTreeData.fire();
    }

    //Move to element that we choose
    getChildren(element?: TodoItem): TodoItem[] {
        if (!element) {
            const files = Array.from(new Set(this.todos.map(todo => todo.file)));
            return files.map(file => new TodoItem(file, vscode.TreeItemCollapsibleState.Collapsed));
        } else {
            return this.todos
                .filter(todo => todo.file === element.label)
                .map(todo =>
                    new TodoItem(
                        `TODO: ${todo.text}`,
                        vscode.TreeItemCollapsibleState.None,
                        todo.file,
                        todo.line
                    )
                );
        }
    }

    getTreeItem(element: TodoItem): vscode.TreeItem {
        return element;
    }
}
