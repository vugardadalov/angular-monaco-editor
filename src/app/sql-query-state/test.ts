// import { Component, HostListener, OnInit } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
// import { editor, KeyCode, KeyMod, Range, Position } from 'monaco-editor';
// import { language, conf } from 'monaco-editor/min/vs/basic-languages/sql/sql';
// import { Key } from 'protractor';
// declare const monaco: any;

// @Component({
//   selector: 'app-sql-query-state',
//   templateUrl: './sql-query-state.component.html',
//   styleUrls: ['./sql-query-state.component.scss']
// })
// export class SqlQueryStateComponent implements OnInit {
//   // @HostListener('document:keydown', ['$event'])
//   // onKeyDown(event: KeyboardEvent): void {
//   //   if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
//   //     // console.log(this.editor.getPosition(), this.editor.getSelection());
//   //     this.editor.focus();
//   //   }
//   // }

//   editor?: editor.ICodeEditor | editor.IEditor;
//   editorContent = SqlQuery;

//   // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
//   defaultEditorOption = {
//     // acceptSuggestionOnEnter: "on",// | "smart" | "off",
//     language: "sql",//json, sql
//     minimap: {
//       enabled: false,
//     },

//     // cursorBlinking: "solid",// | "smooth" | "phase" | "expand" | "solid","blink"
//     // cursorStyle: "line-thin",// "line"| "block" | "underline" | "line-thin" | "block-outline" | "underline-thin"
//     // readOnly: true,
//     // folding:false,

//     scrollbar: {
//       verticalScrollbarSize: 6,
//       horizontalScrollbarSize: 6,
//     },
//     // glyphMargin: true
//     // lineNumbers: false,
//     // fontSize: 10
//   }

//   constructor() { }

//   ngOnInit(): void {
//   }

//   onEditorInit(e: editor.ICodeEditor): void {
//     this.editor = e;
//     console.log(e);
//     // e.updateOptions({ contextmenu: false });

//     // this.actionWithCondition(e);
//     // this.customAction(e);

//     e.onContextMenu(function (e) {
//       // myCondition.set(true);//hide on context menu
//       // myCondition.set(false);//show on context menu
//     });

//     (e as editor.IStandaloneCodeEditor).addCommand(KeyMod.CtrlCmd | KeyCode.Enter, (evt) => {
//       // keydown trigger (CtrlCmd + Enter) on document
//       // const event = new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, metaKey: true, key: 'Enter', cancelable: true });
//       // document.dispatchEvent(event);
//       this.findStatement3(e as editor.IStandaloneCodeEditor);

//     });

//     // e.onDidChangeCursorSelection((e) => {
//     //   const a = (this.editor.getModel() as any).getValueInRange(e.selection);
//     //   console.log(e.selection, a);
//     // });

//     // e.onDidChangeCursorPosition((e: editor.ICursorPositionChangedEvent) => {
//     //   this.findStatement();
//     // });
//   }

//   findStatement1(e: editor.IStandaloneCodeEditor) {
//     console.log(this.editor.getPosition());
//     const prev = (e as editor.IStandaloneCodeEditor).getModel().findPreviousMatch(regex, this.editor.getPosition(), true, false, null, false);
//     const prevValue = (this.editor.getModel() as any).getValueInRange(prev.range);
//     console.log(prev.range, prevValue);

//     const next = (e as editor.IStandaloneCodeEditor).getModel().findNextMatch(';', this.editor.getPosition(), false, false, null, false);
//     const nextValue = (this.editor.getModel() as any).getValueInRange(next.range);
//     console.log(next.range, nextValue);

//     const r = new Range(prev.range.startLineNumber, prev.range.startColumn, next.range.endLineNumber, next.range.endColumn);
//     const rValue = (this.editor.getModel() as any).getValueInRange(r);
//     // console.log(r, rValue);
//     this.editor.setSelection(r);
//   }

//   findStatement2(e: editor.IStandaloneCodeEditor = this.editor as editor.IStandaloneCodeEditor) {
//     const pos: Position = this.editor.getPosition();

//     const minCol = e.getModel().getLineMinColumn(pos.lineNumber);
//     const maxCol = e.getModel().getLineMaxColumn(pos.lineNumber);

//     console.log(pos, minCol, maxCol);

//     const minPos = new Position(pos.lineNumber, minCol);
//     const maxPos = new Position(pos.lineNumber, maxCol);

//     console.log(minPos, maxPos);

//     const prev = (e as editor.IStandaloneCodeEditor).getModel().findPreviousMatch(regex, maxPos, true, false, null, false);
//     const prevValue = (this.editor.getModel() as any).getValueInRange(prev.range);
//     console.log(prev.range, prevValue);

//     const next = (e as editor.IStandaloneCodeEditor).getModel().findNextMatch(';', minPos, false, false, null, false);
//     const nextValue = (this.editor.getModel() as any).getValueInRange(next.range);
//     console.log(next.range, nextValue);

//     const r = new Range(prev.range.startLineNumber, prev.range.startColumn, next.range.endLineNumber, next.range.endColumn);
//     const rValue = (this.editor.getModel() as any).getValueInRange(r);
//     // console.log(r, rValue);
//     this.editor.setSelection(r);
//   }

//   findStatement3(e: editor.IStandaloneCodeEditor = this.editor as editor.IStandaloneCodeEditor) {
//     const startPos = new Position(this.editor.getPosition().lineNumber, e.getModel().getLineMinColumn(this.editor.getPosition().lineNumber));
//     const first = e.getModel().findPreviousMatch(';', startPos, false, false, null, false);

//     if (first) {
//       const prev = e.getModel().findNextMatch(regex, new Position(first.range.endLineNumber, first.range.endColumn), true, false, null, false);
//       const next = e.getModel().findNextMatch(';', startPos, false, false, null, false);

//       if (prev && next) {
//         // const prevValue = (this.editor.getModel() as any).getValueInRange(prev.range);
//         // const nextValue = (this.editor.getModel() as any).getValueInRange(next.range);
//         const queryRange = new Range(prev.range.startLineNumber, prev.range.startColumn, next.range.endLineNumber, next.range.endColumn);
//         const queryValue = (this.editor.getModel() as any).getValueInRange(queryRange);
//         console.log(queryRange, queryValue);
//         this.editor.setSelection(queryRange);
//         // this.hightLight(e, queryRange);
//       }
//     }
//   }

//   hightLight(e: any = this.editor as any, range: Range) {
//     const d: editor.IModelDeltaDecoration[] = [{
//       range: range,
//       options: {
//         isWholeLine: true,
//         linesDecorationsClassName: 'myLineDecoration',
//         hoverMessage: { value: 'RUN' }
//       }
//     },
//     {
//       range,
//       options: {
//         inlineClassName: 'myInlineDecoration'
//       }
//     }];

//     (e as editor.ITextModel).deltaDecorations([], d, 122);
//   }

//   customAction(e: any) {
//     const myAction: editor.IActionDescriptor = {
//       id: "something-neat",
//       label: "Something Neat",
//       contextMenuOrder: 0, // choose the order
//       contextMenuGroupId: "1_modification", // create a new grouping
//       keybindings: [
//         // eslint-disable-next-line no-bitwise
//         KeyMod.CtrlCmd | KeyCode.Enter, // Ctrl + Enter or Cmd + Enter
//       ],
//       run: (editor) => {
//         console.log(editor);
//       },
//     };
//     (e as any).addAction(myAction);
//   }

//   actionWithCondition(e: editor.IStandaloneCodeEditor = this.editor as editor.IStandaloneCodeEditor) {
//     const myCondition = e.createContextKey('myCondition', true);

//     e.addAction({
//       id: 'my-unique-id',
//       label: `WHERE column_name BETWEEN value_1 AND value_2;...`,
//       // keybindings: [
//       //   KeyMod.CtrlCmd | KeyCode.Enter,
//       //   // KeyMod.chord(KeyMod.CtrlCmd | KeyCode.KEY_K, KeyMod.CtrlCmd | KeyCode.KEY_M)
//       // ],
//       precondition: 'myCondition',
//       // keybindingContext: null,
//       contextMenuGroupId: '1_modification',
//       contextMenuOrder: 1,
//       run: function (ed) {
//         //alert("i'm running => " + ed.getPosition());
//         // const event = new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, metaKey: true, key: 'Enter', cancelable: true });
//         // document.dispatchEvent(event);

//         // console.log("i'm running => " + ed.getPosition());

//         return null;
//       }
//     });

//     var myBinding = (e as editor.IStandaloneCodeEditor).addCommand(KeyCode.KEY_L, function () {
//       myCondition.set(false);
//     });

//     // Uncomment this for hiding "My Label" option only once.
//     e.onContextMenu(function (evt) {
//       var a = (e as any).getModel().getLineContent(evt.target.position.lineNumber);
//       var c = (e as any).getAction('my-unique-id');
//       console.log(a, c);
//       if (a.includes('table')) {
//         console.log(a);
//         c._precondition.expr[0].value = 1;
//       } else {
//         c._precondition.expr[0].value = 0;
//       }
//       c.isSupported(true);
//       c.run();
//     });
//   }

//   pos() {
//     console.log(this.editor.getPosition());
//   }

//   mod() {
//     console.log(this.editor.getModel());
//   }

//   sel() {
//     console.log(this.editor.getSelection());
//   }

//   info() {
//     console.log(this.editor);
//   }
// }

// const regex = 'SELECT|CREATE|DELETE|ALTER|DROP|TRUNCATE|INSERT|UPDATE|DESC';

// const SqlQuery = `
// SELECT 
//     call.*,
//     DATEDIFF("SECOND", call.start_time, call.end_time) AS call_duration
// FROM call
// ORDER BY
//     call.employee_id ASC,
//     call.start_time ASC;

// Select * from Employee a where rowid <>( select max(rowid) 
// from Employee b where a.Employee_num=b.Employee_num);

// Select * from Employee where Rowid= select min(Rowid) 
// from Employee;

// Select * from Employee e where rownum <=5
// union
// select * from (Select * from Employee e order by rowid desc) where rownum <=5;

// select distinct salary from employee a where 3 >= (select count(distinct salary) 
// from employee b where a.salary <= b.salary) 
// order by a.salary desc;


// SELECT column_name(s)
// FROM table_name
// WHERE column_name BETWEEN value_1 AND value_2;

// SELECT 
// 	country.country_name_eng,
// 	SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls,
// 	AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
// FROM country 
// LEFT JOIN city ON city.country_id = country.id
// LEFT JOIN customer ON city.id = customer.city_id
// LEFT JOIN call ON call.customer_id = customer.id
// GROUP BY 
// 	country.id,
// 	country.country_name_eng
// ORDER BY calls DESC, country.id ASC;


// CREATE TABLE table_name (
//   column_1 datatype, 
//   column_2 datatype, 
//   column_3 datatype
// );


// DELETE FROM table_name
// WHERE some_column = some_value;

// SELECT 
// 	country.country_name_eng,
// 	SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls,
// 	AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
// FROM country 
// LEFT JOIN city ON city.country_id = country.id
// LEFT JOIN customer ON city.id = customer.city_id
// LEFT JOIN call ON call.customer_id = customer.id
// GROUP BY 
// 	country.id,
// 	country.country_name_eng
// HAVING AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) > (SELECT AVG(DATEDIFF(SECOND, call.start_time, call.end_time)) FROM call)
// ORDER BY calls DESC, country.id ASC;

// -- the query returns a call summary for countries having average call duration > average call duration of all calls
// SELECT 
//     country.country_name_eng,
//     SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls,
//     AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
// FROM country 
// -- we've used left join to include also countries without any call
// LEFT JOIN city ON city.country_id = country.id
// LEFT JOIN customer ON city.id = customer.city_id
// LEFT JOIN call ON call.customer_id = customer.id
// GROUP BY 
//     country.id,
//     country.country_name_eng
// -- filter out only countries having an average call duration > average call duration of all calls
// HAVING AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) > (SELECT AVG(DATEDIFF(SECOND, call.start_time, call.end_time)) FROM call)
// ORDER BY calls DESC, country.id ASC;

// `

// interface IPosition {
//   lineNumber: number;
//   column: number;
// } 