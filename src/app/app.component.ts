import { Component } from '@angular/core';
import { editor } from 'monaco-editor';
import { UtilService } from './util.service';
import { HttpErrorResponse } from '@angular/common/http';
import { conf, language } from './custom-sql-config';

declare const monaco: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  editor?: editor.ICodeEditor | editor.IEditor;
  editorContent = `SELECT column_name(s)
  FROM table_name
  WHERE column_name BETWEEN value1 AND value2;`;

  // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
  defaultEditorOption = {
    acceptSuggestionOnEnter: "on",// | "smart" | "off",
    cursorBlinking: "blink",// | "smooth" | "phase" | "expand" | "solid",
    cursorStyle: "line",// | "block" | "underline" | "line-thin" | "block-outline" | "underline-thin"
    language: "sql"//json, sql
  }

  constructor(private utilService: UtilService) { }

  onEditorInit(e: editor.ICodeEditor | editor.IEditor): void {
    this.editor = e;
    // console.log(monaco.languages);
    // console.log(e);
    // this.setSuggestion()
    // this.applyCustomSql();
    // this.editor.setModel(monaco.editor.createModel("console.log('Hello ng-zorro-antd')", 'typescript'));
  }

  setSuggestion() {
    monaco.languages.register({ id: 'sql' });
    monaco.languages.registerCompletionItemProvider('sql', {
      triggerCharacters:["."],
			autoIndent:true,
      provideCompletionItems: (model, position) => {
        var word = model.getWordUntilPosition(position);
        var range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,// - 1, // UNCOMMENT THIS AND IT BREAKS
          endColumn: word.endColumn
      };
        var suggestions = [
          {
            label: 'call_center',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'call_center',
            documentation:'Table',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range
          },
          {
            label: 'testing',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'testing(${1:condition})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'ifelse',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'If-Else Statement',
          },
        ];
        return { suggestions: suggestions };
      },
    });
  }

  getData(): void {
    this.utilService.pull()
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response) {
            this.editorContent = JSON.stringify(response);

            var self = this;
            setTimeout(function () {
              // self.editor.getAction('editor.action.formatDocument').run();
            }, 0);
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

  // For custom language
  applyCustomSql() {
    monaco.languages.register({ id: 'custom-sql' });
    monaco.languages.setLanguageConfiguration('custom-sql', conf);
    monaco.languages.setMonarchTokensProvider('custom-sql', language);
  }
}