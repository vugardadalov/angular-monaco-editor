import { Component, HostListener, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { editor, KeyCode, KeyMod, Range } from 'monaco-editor';
import { language, conf } from 'monaco-editor/min/vs/basic-languages/sql/sql';
import { Key } from 'protractor';
declare const monaco: any;

@Component({
  selector: 'app-sql-query-state',
  templateUrl: './sql-query-state.component.html',
  styleUrls: ['./sql-query-state.component.scss']
})
export class SqlQueryStateComponent implements OnInit {
  // @HostListener('document:keydown', ['$event'])
  // onKeyDown(event: KeyboardEvent): void {
  //   if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
  //     console.log(this.editor.getPosition(), this.editor.getSelection());
  //   }
  // }

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

  onEditorInit(e: editor.ICodeEditor): void {
    this.editor = e;
    console.log(e);
    // e.updateOptions({ contextmenu: false });

    // this.actionWithCondition(e);
    // this.customAction(e);

    e.onContextMenu(function (e) {
      // myCondition.set(true);//hide on context menu
      // myCondition.set(false);//show on context menu
    });

    (e as editor.IStandaloneCodeEditor).addCommand(KeyMod.CtrlCmd | KeyCode.Enter, (evt) => {
      // keydown trigger (CtrlCmd + Enter) on document
      // const event = new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, metaKey: true, key: 'Enter', cancelable: true });
      // document.dispatchEvent(event);
      this.findStatement(e as editor.IStandaloneCodeEditor);

    });

    // e.onDidChangeCursorSelection((e) => {
    //   const a = (this.editor.getModel() as any).getValueInRange(e.selection);
    //   console.log(e.selection, a);
    // });
  }

  findStatement(e: editor.IStandaloneCodeEditor) {
    console.log(this.editor.getPosition());
    var regex = 'SELECT|CREATE|DELETE|ALTER|DROP|TRUNCATE|INSERT|UPDATE|DESC';

    const prev = (e as editor.IStandaloneCodeEditor).getModel().findPreviousMatch(regex, this.editor.getPosition(), true, false, null, false);
    const prevValue = (this.editor.getModel() as any).getValueInRange(prev.range);
    console.log(prev.range, prevValue);

    const next = (e as editor.IStandaloneCodeEditor).getModel().findNextMatch(';', this.editor.getPosition(), false, false, null, false);
    const nextValue = (this.editor.getModel() as any).getValueInRange(next.range);
    console.log(next.range, nextValue);

    const r = new Range(prev.range.startLineNumber, prev.range.startColumn, next.range.endLineNumber, next.range.endColumn);
    const rValue = (this.editor.getModel() as any).getValueInRange(r);
    // console.log(r, rValue);
    this.editor.setSelection(r);
  }

  customAction(e: any) {
    const myAction: editor.IActionDescriptor = {
      id: "something-neat",
      label: "Something Neat",
      contextMenuOrder: 0, // choose the order
      contextMenuGroupId: "1_modification", // create a new grouping
      keybindings: [
        // eslint-disable-next-line no-bitwise
        KeyMod.CtrlCmd | KeyCode.Enter, // Ctrl + Enter or Cmd + Enter
      ],
      run: (editor) => {
        console.log(editor);
      },
    };
    (e as any).addAction(myAction);
  }

  actionWithCondition(e) {
    const myCondition = (e as editor.IStandaloneCodeEditor).createContextKey('myCondition', true);

    (e as editor.IStandaloneCodeEditor).addAction({
      id: 'my-unique-id',
      label: `WHERE column_name BETWEEN value_1 AND value_2;...`,
      // keybindings: [
      //   KeyMod.CtrlCmd | KeyCode.Enter,
      //   // KeyMod.chord(KeyMod.CtrlCmd | KeyCode.KEY_K, KeyMod.CtrlCmd | KeyCode.KEY_M)
      // ],
      precondition: 'myCondition',
      // keybindingContext: null,
      contextMenuGroupId: '1_modification',
      contextMenuOrder: 1,
      run: function (ed) {
        //alert("i'm running => " + ed.getPosition());
        // const event = new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, metaKey: true, key: 'Enter', cancelable: true });
        // document.dispatchEvent(event);

        // console.log("i'm running => " + ed.getPosition());

        return null;
      }
    });

    var myBinding = (e as editor.IStandaloneCodeEditor).addCommand(KeyCode.KEY_L, function () {
      myCondition.set(false);
    });

    // Uncomment this for hiding "My Label" option only once.
    e.onContextMenu(function (evt) {
      var a = (e as any).getModel().getLineContent(evt.target.position.lineNumber);
      var c = (e as any).getAction('my-unique-id');
      console.log(a, c);
      if (a.includes('table')) {
        console.log(a);
        c._precondition.expr[0].value = 1;
      } else {
        c._precondition.expr[0].value = 0;
      }
      c.isSupported(true);
      c.run();
    });
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