import { Component } from '@angular/core';
import { editor } from 'monaco-editor';

// tslint:disable-next-line no-any
declare const monaco: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  editor?: editor.ICodeEditor | editor.IEditor;
  code = `import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor'`;

  // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
  defaultEditorOption = {
    acceptSuggestionOnEnter: "on",// | "smart" | "off",
    cursorBlinking: "blink",// | "smooth" | "phase" | "expand" | "solid",
    cursorStyle: "line",// | "block" | "underline" | "line-thin" | "block-outline" | "underline-thin"
    language: "typescript"
  }



  onEditorInit(e: editor.ICodeEditor | editor.IEditor): void {
    console.log(e);
    
    this.editor = e;
    // this.editor.setModel(monaco.editor.createModel("console.log('Hello ng-zorro-antd')", 'typescript'));
  }
}