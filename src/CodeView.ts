import * as vscode from 'vscode'

var QRCode = require('qrcode')

export class CodeView {
  private static panel: vscode.WebviewPanel | undefined

  public static async show() {
    const hide = vscode.window.setStatusBarMessage('QR-code generate start....')

    try {
      const editor = vscode.window.activeTextEditor
      const selection = editor.selection
      const text = editor.document.getText(selection)
      const imageData = await QRCode.toDataURL(text)
      if (this.panel) {
        this.panel.webview.html = this.generateHtml(imageData)
        this.panel.reveal()
      } else {
        this.panel = vscode.window.createWebviewPanel('resport', 'QR-code', vscode.ViewColumn.Two, {
          enableScripts: true,
          retainContextWhenHidden: true
        })
        this.panel.webview.html = this.generateHtml(imageData)
        this.panel.onDidDispose(() => {
          this.panel = undefined
        })
      }

      vscode.window.setStatusBarMessage('QR-code generate success', 3000)
    } catch (error) {
      vscode.window.setStatusBarMessage('QR-code generate failed', 3000)
    } finally {
      hide.dispose()
    }
  }

  protected static generateHtml(imageData: vscode.Uri | string): string {
    let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>QR-code</title>
        </head>
        <body>
            <div><h1>QR-code</h1></div>
            <div><img src="${imageData}"></div>
        </body>
		</html>`

    return html
  }
}
