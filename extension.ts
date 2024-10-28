import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Función para cargar la información desde el archivo JSON
function loadCommandsFromJSON(filePath: string): string[] {
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(rawData);
        // Retorna las claves de los comandos
        return Object.keys(jsonData);
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
        return [];
    }
}

export function activate(context: vscode.ExtensionContext) {
    const jsonFilePath = path.join(context.extensionPath, 'info2.json');
    const commands = loadCommandsFromJSON(jsonFilePath); // Cargar comandos desde info.json

    // Registrar el proveedor de autocompletado
    const completionProvider = vscode.languages.registerCompletionItemProvider('cpp', {
        provideCompletionItems(document, position) {
            const completionItems: vscode.CompletionItem[] = [];

            // Generar un item de autocompletado para cada comando
            for (const command of commands) {
                const item = new vscode.CompletionItem(command, vscode.CompletionItemKind.Method);
                completionItems.push(item);
            }

            return completionItems;
        }
    });

    context.subscriptions.push(completionProvider);
}

export function deactivate() {}
