import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as uuid from 'uuid';
import * as invariant from 'invariant';
import { TaalEditor, TaalTranslation, TaalEditorProps } from 'taal-editor';
import * as Slate from 'slate';

@Component({
  selector: 'app-taal-editor',
  templateUrl: './taal-editor.component.html',
  styleUrls: ['./taal-editor.component.less']
})
export class TaalEditorComponent implements OnInit {

  @Input() initialValue: TaalTranslation;
  @Output() changed: EventEmitter<Slate.Value> = new EventEmitter();

  private rootDomID: string;
    
  protected getRootDomNode() {
      const node = document.getElementById(this.rootDomID);
      invariant(node, `Node '${this.rootDomID} not found!`);
      return node;
  }

    protected getProps(): TaalEditorProps {
        const {
            initialValue,
            onChange
        } = this;
        return {
            initialValue,
            onChange
        };
    }

    onChange = ($event: Slate.Value) => {
        this.changed.emit($event)
    }

  private isMounted(): boolean {
      return !!this.rootDomID;
  }

  protected render() {
      if (this.isMounted()) {
          ReactDOM.render(React.createElement(TaalEditor, this.getProps()), this.getRootDomNode());
      }
  }

  ngOnInit() {
      this.rootDomID = uuid.v1();
  }

  ngOnChanges() {
      this.render();
  }

  ngAfterViewInit() {
      this.render();
  }
}