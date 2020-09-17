import { Component } from '@angular/core';
import { editor } from 'monaco-editor';
import { UtilService } from './util.service';
import { HttpErrorResponse } from '@angular/common/http';

// tslint:disable-next-line no-any
declare const monaco: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  editor?: editor.ICodeEditor | editor.IEditor;
  editorContent = '{"hello":"er"}';

  // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
  defaultEditorOption = {
    acceptSuggestionOnEnter: "on",// | "smart" | "off",
    cursorBlinking: "blink",// | "smooth" | "phase" | "expand" | "solid",
    cursorStyle: "line",// | "block" | "underline" | "line-thin" | "block-outline" | "underline-thin"
    language: "json"
  }

  constructor(private utilService: UtilService) {
    // this.getData();
  }

  onEditorInit(e: editor.ICodeEditor | editor.IEditor): void {
    console.log(e);
    console.log(monaco);
    
    this.editor = e;
    // this.editor.setModel(monaco.editor.createModel("console.log('Hello ng-zorro-antd')", 'typescript'));
  }

  getData(): void {
    this.utilService.pull()
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response) {
            this.editorContent = JSON.stringify(response);

            var self = this;
            setTimeout(function() {
              self.editor.getAction('editor.action.formatDocument').run();
            },0);
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        });
  }

  saveData(): void {
    this.utilService.push('url', {})
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response) {
            this.editorContent = response;
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        });
  }
}