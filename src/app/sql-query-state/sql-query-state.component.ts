import { Component, HostListener, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { editor } from 'monaco-editor';
import { language, conf } from 'monaco-editor/min/vs/basic-languages/sql/sql';
declare const monaco: any;

@Component({
  selector: 'app-sql-query-state',
  templateUrl: './sql-query-state.component.html',
  styleUrls: ['./sql-query-state.component.scss']
})
export class SqlQueryStateComponent implements OnInit {
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      console.log(this.editor.getPosition(), this.editor.getSelection());
      
    }
  }
  
  editor?: editor.ICodeEditor | editor.IEditor;
  editorContent = SqlQuery;

  // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
  defaultEditorOption = {
    // acceptSuggestionOnEnter: "on",// | "smart" | "off",
    language: "sql",//json, sql
    minimap: {
      enabled: false,
    },

    // cursorBlinking: "solid",// | "smooth" | "phase" | "expand" | "solid","blink"
    // cursorStyle: "line-thin",// "line"| "block" | "underline" | "line-thin" | "block-outline" | "underline-thin"
    // readOnly: true,
    // folding:false,

    scrollbar: {
      verticalScrollbarSize: 6,
      horizontalScrollbarSize: 6,
    },
    // lineNumbers: false,
    // fontSize: 10
  }

  constructor() { }

  ngOnInit(): void {
  }

  onEditorInit(e: editor.ICodeEditor | editor.IEditor): void {
    this.editor = e;
    console.log(e);

    (e as any).addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, (e: any) => {
      // keydown trigger (CtrlCmd + Enter) on document
      const event = new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, metaKey: true, key: 'Enter', cancelable: true });
      document.dispatchEvent(event);
    });

    (e as any).onDidChangeCursorSelection((e) => {
      console.log(e);
      const a = (this.editor.getModel() as any).getValueInRange(e.selection);
      console.log(a);
    });
    // e.updateOptions({});
  }

  pos() {
    console.log(this.editor.getPosition());
  }

  mod() {
    console.log(this.editor.getModel());
  }

  sel() {
    console.log(this.editor.getSelection());
  }

  info() {
    console.log(this.editor);
  }
}

const SqlQuery = `
SELECT 
    call.*,
    DATEDIFF("SECOND", call.start_time, call.end_time) AS call_duration
FROM call
ORDER BY
    call.employee_id ASC,
    call.start_time ASC;


    SELECT column_name(s)
FROM table_name
WHERE column_name BETWEEN value_1 AND value_2;


CREATE TABLE table_name (
  column_1 datatype, 
  column_2 datatype, 
  column_3 datatype
);


DELETE FROM table_name
WHERE some_column = some_value;
`

interface IPosition {
  lineNumber: number;
  column: number;
} 