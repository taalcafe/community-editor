import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
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

    @Input() disabled: boolean;
    @Input() index: number;
    @Input() initialValue: TaalTranslation;
    @Output() taalEditorChange: EventEmitter<{value: Slate.Value, index: number }> = new EventEmitter();

    private rootDomID: string;
    @ViewChild('taalEditor') el: ElementRef;
        
    protected getRootDomNode() {
        const node = this.el.nativeElement;
        invariant(node, `Node '${this.rootDomID} not found!`);
        return node;
    }
    onChange = ($event: Slate.Value) => {
        this.taalEditorChange.emit({value: $event, index: this.index})
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
        this.render()
    }

    ngAfterViewInit() {
        this.render()
    }
}