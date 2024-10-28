import * as fs from 'fs';
import * as path from 'path';

// Función para cargar la información desde el archivo JSON
function loadInfoFromJSON(filePath: string): { [key: string]: string } {
    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
        return {};
    }
}

export function activate(context: vscode.ExtensionContext) {
    const jsonFilePath = path.join(context.extensionPath, 'info.json');
    const hoverInfo = loadInfoFromJSON(jsonFilePath); // Cargar información desde info.json

    const hoverProvider = vscode.languages.registerHoverProvider('cpp', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);

            // Verifica si hay información para la palabra bajo el cursor
            if (hoverInfo[word]) {
                const markdownString = new vscode.MarkdownString(hoverInfo[word]);
                markdownString.isTrusted = true;
                return new vscode.Hover(markdownString);
            }

            return null;
        }
    });

    context.subscriptions.push(hoverProvider);
}

export function deactivate() {}
