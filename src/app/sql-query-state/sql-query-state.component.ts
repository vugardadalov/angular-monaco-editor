import { Component } from '@angular/core';
import { editor, KeyCode, KeyMod, Range, Position, IRange } from 'monaco-editor';
// declare const monaco: any;

@Component({
  selector: 'app-sql-query-state',
  templateUrl: './sql-query-state.component.html',
  styleUrls: ['./sql-query-state.component.scss']
})
export class SqlQueryStateComponent {
  // @HostListener('document:keydown', ['$event'])
  // onKeyDown(event: KeyboardEvent): void {
  //   if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
  //     // console.log(this.editor.getPosition(), this.editor.getSelection());
  //     this.editor.focus();
  //   }
  // }

  editor?: editor.ICodeEditor | editor.IEditor | editor.IStandaloneCodeEditor;
  editorContent = SqlQuery;

  queryValue: string;
  queryRange: IRange;

  deltaDecoration: string[] = [];

  defaultEditorOption: editor.IStandaloneEditorConstructionOptions = {
    language: "sql",//json, sql
    minimap: {
      enabled: false,
    }
  }

  onEditorInit(e: editor.ICodeEditor): void {
    this.editor = e;

    e.onContextMenu(function (e) {
      // myCondition.set(true);//hide on context menu
      // myCondition.set(false);//show on context menu
    });

    (e as editor.IStandaloneCodeEditor).addCommand(KeyMod.CtrlCmd | KeyCode.Enter, (evt) => {
      // const event = new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, metaKey: true, key: 'Enter', cancelable: true });
      // document.dispatchEvent(event);
      // this.findStatement(e as editor.IStandaloneCodeEditor);
      this.editor.setSelection(this.queryRange);
    });

    // e.onDidChangeCursorSelection((e) => {
    //   const a = (this.editor.getModel() as any).getValueInRange(e.selection);
    //   console.log(e.selection, a);
    // });

    e.onDidChangeCursorPosition((evt: editor.ICursorPositionChangedEvent) => {
      this.findStatement(this.editor as editor.IStandaloneCodeEditor);
      this.hightLight(this.editor, this.queryRange);

      // const pos = this.editor.getPosition();
      // if(pos.lineNumber > this.queryRange.startLineNumber){
      //   this.editor.revealLine(this.queryRange.startLineNumber, editor.ScrollType.Smooth)
      // }
      // if(pos.lineNumber < this.queryRange.endLineNumber){
      //   this.editor.revealLine(this.queryRange.endLineNumber, editor.ScrollType.Smooth)
      // }
    });

    // (this.editor as editor.IStandaloneCodeEditor).onDidBlurEditorText(() => {
    //   console.log('onDidFocusEditorWidget');
    // });
  }

  findStatement(e: editor.IStandaloneCodeEditor = this.editor as editor.IStandaloneCodeEditor) {
    const startPos = new Position(this.editor.getPosition().lineNumber, e.getModel().getLineMinColumn(this.editor.getPosition().lineNumber));
    const first = e.getModel().findPreviousMatch(';', startPos, false, false, null, false);

    if (first) {
      const prev = e.getModel().findNextMatch(regex, new Position(first.range.endLineNumber, first.range.endColumn), true, false, null, false);
      const next = e.getModel().findNextMatch(';', startPos, false, false, null, false);

      if (prev && next) {
        this.queryRange = new Range(prev.range.startLineNumber, prev.range.startColumn, next.range.endLineNumber, next.range.endColumn);
        this.queryValue = (this.editor.getModel() as any).getValueInRange(this.queryRange);
        // console.log(this.queryRange, this.queryValue);
      }
    }
  }

  hightLight(e: any = this.editor as any, range: IRange) {
    let newDec = [];
    if (range) {
      newDec.push({
        range: range,
        options: {
          isWholeLine: true,
          linesDecorationsClassName: 'my-line-decoration',
          // hoverMessage: { value: 'RUN' }
        }
      })
    }
    this.deltaDecoration = (e as editor.ITextModel).deltaDecorations(this.deltaDecoration || [], newDec);
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

const regex = 'SELECT|CREATE|DELETE|ALTER|DROP|TRUNCATE|INSERT|UPDATE|DESC';

const SqlQuery = `
SELECT 
    call.*,
    DATEDIFF("SECOND", call.start_time, call.end_time) AS call_duration
FROM call
ORDER BY
    call.employee_id ASC,
    call.start_time ASC;

Select * from Employee a where rowid <>( select max(rowid) 
from Employee b where a.Employee_num=b.Employee_num);

Select * from Employee where Rowid= select min(Rowid) 
from Employee;

Select * from Employee e where rownum <=5
union
select * from (Select * from Employee e order by rowid desc) where rownum <=5;

select distinct salary from employee a where 3 >= (select count(distinct salary) 
from employee b where a.salary <= b.salary) 
order by a.salary desc;


SELECT column_name(s)
FROM table_name
WHERE column_name BETWEEN value_1 AND value_2;

SELECT 
	country.country_name_eng,
	SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls,
	AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
FROM country 
LEFT JOIN city ON city.country_id = country.id
LEFT JOIN customer ON city.id = customer.city_id
LEFT JOIN call ON call.customer_id = customer.id
GROUP BY 
	country.id,
	country.country_name_eng
ORDER BY calls DESC, country.id ASC;


CREATE TABLE table_name (
  column_1 datatype, 
  column_2 datatype, 
  column_3 datatype
);


DELETE FROM table_name
WHERE some_column = some_value;

SELECT 
	country.country_name_eng,
	SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls,
	AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
FROM country 
LEFT JOIN city ON city.country_id = country.id
LEFT JOIN customer ON city.id = customer.city_id
LEFT JOIN call ON call.customer_id = customer.id
GROUP BY 
	country.id,
	country.country_name_eng
HAVING AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) > (SELECT AVG(DATEDIFF(SECOND, call.start_time, call.end_time)) FROM call)
ORDER BY calls DESC, country.id ASC;

-- the query returns a call summary for countries having average call duration > average call duration of all calls
SELECT 
    country.country_name_eng,
    SUM(CASE WHEN call.id IS NOT NULL THEN 1 ELSE 0 END) AS calls,
    AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) AS avg_difference
FROM country 
-- we've used left join to include also countries without any call
LEFT JOIN city ON city.country_id = country.id
LEFT JOIN customer ON city.id = customer.city_id
LEFT JOIN call ON call.customer_id = customer.id
GROUP BY 
    country.id,
    country.country_name_eng
-- filter out only countries having an average call duration > average call duration of all calls
HAVING AVG(ISNULL(DATEDIFF(SECOND, call.start_time, call.end_time),0)) > (SELECT AVG(DATEDIFF(SECOND, call.start_time, call.end_time)) FROM call)
ORDER BY calls DESC, country.id ASC;

`

// // temp1.trigger('Hello', 'editor.action.triggerSuggest', 'Hello');