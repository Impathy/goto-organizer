import * as vscode from 'vscode';
import { TodoTreeDataProvider } from './todoProvider';
import { findTodosInDocument, highlightTodos } from './todoUtils';

//The main command 
export function activate(context: vscode.ExtensionContext) {
    
    //Create a Tree Viev 
    const todoProvider = new TodoTreeDataProvider();
    vscode.window.createTreeView('todoView', { treeDataProvider: todoProvider });

    //Register a command to find 
    context.subscriptions.push(
        vscode.commands.registerCommand('todo-organizer.refresh', async () => {
            const files = await vscode.workspace.findFiles('**/*.{js,ts,cpp}');
            const allTodos = [];
            
            //Scan all files to find TODOs
            for (const file of files) {
                const document = await vscode.workspace.openTextDocument(file);
                const todos = findTodosInDocument(document).map(todo => ({
                    file: file.fsPath,
                    ...todo
                }));
                allTodos.push(...todos);
            }
            //Update TODOs tree
            todoProvider.refresh(allTodos);
        })
    );

    //Register "go to TODO" command, this command will move you in to file which you choose
    context.subscriptions.push(
        vscode.commands.registerCommand('todo-organizer.goToTodo', ({ file, line }) => {
            const uri = vscode.Uri.file(file);
            vscode.window.showTextDocument(uri).then(editor => {
                const position = new vscode.Position(line - 1, 0);
                editor.revealRange(new vscode.Range(position, position));
            });
        })
    );

	//Add color for TODO in active file
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            const todos = findTodosInDocument(editor.document);
            highlightTodos(editor, todos);
        }
    });
    
    //Coloring TODO in active file 
    vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document === event.document) {
            const todos = findTodosInDocument(editor.document);
            highlightTodos(editor, todos);
        }
    });
}
