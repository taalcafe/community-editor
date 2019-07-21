import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as uuid from 'uuid';
import * as invariant from 'invariant';
import { TaalEditor, TaalTranslation, TaalEditorProps, TaalIcuExpression, TaalPart } from 'taal-editor';
import * as Slate from 'slate';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-taal-editor',
  templateUrl: './taal-editor.component.html',
  styleUrls: ['./taal-editor.component.less']
})
export class TaalEditorComponent implements OnInit {

    @Input() action$: Observable<{ index: number, action: string, data: any }>;
    @Input() readonly: boolean;
    @Input() index: number;

    @Input() parts: TaalPart[];
    @Input() icuExpressions: TaalIcuExpression[];

    @Output() taalEditorChange: EventEmitter<{value: Slate.Value, index: number }> = new EventEmitter();

    public rootDomID: string;
    @ViewChild('taalEditor') el: ElementRef;

    taalEditorInstance: TaalEditor;

    ngUnsubscribe = new Subject<void>();
        
    protected getRootDomNode() {
        const node = this.el.nativeElement;
        invariant(node, `Node '${this.rootDomID} not found!`);
        return node;
    }
    onChange = ($event: Slate.Value) => {
        this.taalEditorChange.emit({value: $event, index: this.index})
    }

    private isMounted(): boolean {
        return !!this.rootDomID;
    }

    protected render() {
        if (this.isMounted()) {
            this.taalEditorInstance = ReactDOM.render(
                React.createElement(
                    TaalEditor,

                    <TaalEditorProps>{
                        readonly: this.readonly,
                        setRef: undefined,
                        onChange: this.onChange,
                        initialValue: { parts: this.parts, icuExpressions: this.icuExpressions }
                    }),
                    this.getRootDomNode()
                );
        }
    }

    ngOnInit() {
        this.rootDomID = uuid.v1();
    }

    ngAfterViewInit() {
        this.render();
        if(!this.readonly) {
            this.action$.pipe(
                filter(_ => _.index === this.index),
                takeUntil(this.ngUnsubscribe))
                .subscribe(_ => {
                    switch(_.action) {
                        case 'ADD_PLACEHOLDER': {
                            this.taalEditorInstance.addPlaceholder(_.data.key, _.data.value);
                            break;
                        }
                        case 'ADD_ICU_MESSAGE_REF': {
                            this.taalEditorInstance.addIcuExpression(_.data.key, _.data.value);
                            break;
                        }
                    }
                })
        }
    }
 
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}