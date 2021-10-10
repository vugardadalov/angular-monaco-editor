import { Component, HostListener } from '@angular/core';
import { editor, KeyCode, KeyMod, Range, Position, IRange, IPosition } from 'monaco-editor';
import { SqlQuery, SqlRegex } from './sql-query'

@Component({
  selector: 'app-sql-query-state',
  templateUrl: './sql-query-state.component.html',
  styleUrls: ['./sql-query-state.component.scss']
})
export class SqlQueryStateComponent {
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      if (this.editor.hasTextFocus()) {
        this.editor.setSelection(this.queryRange);
      } else {
        this.editor.focus();

        if (this.queryRange && this.queryValue) {
          this.editor.setSelection(this.queryRange);
        } else {
          this.findStatement(this.editor as editor.IStandaloneCodeEditor);
          this.hightLight(this.editor, this.queryRange);
        }
      }
    }
  }

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
    console.clear();
    this.editor = e;

    e.onContextMenu(function (e) {
      // myCondition.set(true);//hide on context menu
      // myCondition.set(false);//show on context menu
    });

    (e as editor.IStandaloneCodeEditor).addCommand(KeyMod.CtrlCmd | KeyCode.Enter, (evt) => {
      const event = new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, metaKey: true, key: 'Enter', cancelable: true });
      document.dispatchEvent(event);
    });

    // e.onDidChangeCursorSelection((e) => {
    //   const a = (this.editor.getModel() as any).getValueInRange(e.selection);
    //   console.log(e.selection, a);
    // });

    e.onDidChangeCursorPosition((evt: editor.ICursorPositionChangedEvent) => {
      this.findStatement2(this.editor as editor.IStandaloneCodeEditor);
      this.hightLight(this.editor, this.queryRange);

      // const pos = this.editor.getPosition();
      // if(pos.lineNumber > this.queryRange.startLineNumber){
      //   this.editor.revealLine(this.queryRange.startLineNumber, editor.ScrollType.Smooth)
      // }
      // if(pos.lineNumber < this.queryRange.endLineNumber){
      //   this.editor.revealLine(this.queryRange.endLineNumber, editor.ScrollType.Smooth)
      // }
    });
  }

  findStatement2(e: editor.IStandaloneCodeEditor = this.editor as editor.IStandaloneCodeEditor) {
    this.queryRange = null;
    this.queryValue = null;

    const lineCount = e.getModel().getLineCount();

    let start = { lineNumber: 1, column: 1 };
    let end = { lineNumber: lineCount, column: e.getModel().getLineMaxColumn(lineCount) };

    const currentLine = e.getPosition().lineNumber;
    const currentContent = e.getModel().getLineContent(currentLine).trim();

    if (!currentContent) return;

    for (let i = currentLine - 1; i >= start.lineNumber; i--) {
      const content = e.getModel().getLineContent(i).trim();
      if (!content || content.includes(';')) {
        start.lineNumber = i + 1;
        break;
      }
    }

    for (let i = currentLine; i <= end.lineNumber; i++) {
      const content = e.getModel().getLineContent(i).trim();
      if (!content) {
        end.lineNumber =  i - 1;
        end.column = e.getModel().getLineMaxColumn(i - 1);
        break;
      } else if (content.includes(';')) {
        end.lineNumber =  i;
        end.column = e.getModel().getLineMaxColumn(i);
        break;
      }
    }

    this.queryRange = new Range(start.lineNumber, start.column, end.lineNumber, end.column);
    this.queryValue = (this.editor.getModel() as any).getValueInRange(this.queryRange);

    console.log(start, end, currentLine);
    console.log(this.queryRange, this.queryValue);
  }

  findStatement(e: editor.IStandaloneCodeEditor = this.editor as editor.IStandaloneCodeEditor) {
    console.log(e.getModel());

    const startPos = new Position(this.editor.getPosition().lineNumber, e.getModel().getLineMinColumn(this.editor.getPosition().lineNumber));
    const first = e.getModel().findPreviousMatch(';', startPos, false, false, null, false);

    console.log(startPos, first);

    if (first) {
      const prev = e.getModel().findNextMatch(SqlRegex, new Position(first.range.endLineNumber, first.range.endColumn), true, false, null, false);
      const next = e.getModel().findNextMatch(';', startPos, false, false, null, false);

      console.log(prev, next);

      if (prev && next) {
        this.queryRange = new Range(prev.range.startLineNumber, prev.range.startColumn, next.range.endLineNumber, next.range.endColumn);
        this.queryValue = (this.editor.getModel() as any).getValueInRange(this.queryRange);
        // console.log(this.queryRange, this.queryValue);
      }
    }
  }

  hightLight(e: any = this.editor as any, range: IRange) {
    let newDec: editor.IModelDeltaDecoration[] = [];
    if (range) {
      newDec.push({
        range: range,
        options: {
          isWholeLine: true,
          linesDecorationsClassName: 'my-line-decoration',
          hoverMessage: { value: 'Run' },
          // beforeContentClassName: "extra-cursor"
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