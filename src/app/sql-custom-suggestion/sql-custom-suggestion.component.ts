import { Component, OnInit } from '@angular/core';
import { editor } from 'monaco-editor';
import { language, conf } from 'monaco-editor/min/vs/basic-languages/sql/sql';
import { UtilService } from '../util.service';
declare const monaco: any;

@Component({
  selector: 'app-sql-custom-suggestion',
  templateUrl: './sql-custom-suggestion.component.html',
  styleUrls: ['./sql-custom-suggestion.component.scss']
})
export class SqlCustomSuggestionComponent {

  editor?: editor.ICodeEditor | editor.IEditor;
  editorContent = `SELECT column_name(s)
  FROM table_name
  WHERE column_name BETWEEN value1 AND value2;`;

  // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
  defaultEditorOption = {
    acceptSuggestionOnEnter: "on",// | "smart" | "off",
    cursorBlinking: "blink",// | "smooth" | "phase" | "expand" | "solid",
    cursorStyle: "line",// | "block" | "underline" | "line-thin" | "block-outline" | "underline-thin"
    language: "sql",//json, sql
  }

  syntaxMap: any = {
    builtinFunctions: "Function",
    // builtinVariables: "Variable",
    keywords: "Keyword",
    operators: "Operator",
    table: "Table",
    column: "Column"
  };

  constructor(private utilService: UtilService) { }

  onEditorInit(e: editor.ICodeEditor | editor.IEditor): void {
    this.editor = e;

    this.setSuggestion();
  }

  setSuggestion() {
    monaco.languages.register({ id: 'sql' });
    monaco.languages.registerCompletionItemProvider('sql', {
      triggerCharacters: [" "],
      autoIndent: true,
      provideCompletionItems: (model, position) => {
        var word = model.getWordUntilPosition(position);
        var range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        return { suggestions: this.getSyntaxItems(range) };
      },
      resolveCompletionItem(item) {
        // item.insertText = item.label.toUpperCase();
        if (item.kind !== monaco.languages.CompletionItemKind.File) {
          item.insertText = item.label.toUpperCase();
        } else {
          item.insertText = item.label;
        }


        if (item.kind === monaco.languages.CompletionItemKind.Function) {
          item.insertText += '()';
        }

        item.documentation = 'Some placeholder documentation';

        return item;
      }
    });
  }

  getSyntaxItems(range: any) {
    let result = [];
    let resultPerType = [];

    for (let type in this.syntaxMap) {
      if (type === 'table' || type === 'column') {
        for (let i = 1; i <= 20; i++) {
          let label = `${type}${i}`;

          resultPerType.push({
            label,
            kind: monaco.languages.CompletionItemKind.File,
            detail: type,
            range
          });
        }
      } else {
        resultPerType = language[type].map(item => {
          return {
            label: item.toString().toLowerCase(),
            kind: monaco.languages.CompletionItemKind[this.syntaxMap[type]],
            range
          }
        });
      }

      result.push(...resultPerType);
    }

    return result;
  }

  // For custom language
  applyCustomSql() {
    monaco.languages.register({ id: 'custom-sql' });
    monaco.languages.setLanguageConfiguration('custom-sql', conf);
    monaco.languages.setMonarchTokensProvider('custom-sql', language);
  }
};