import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { convertFromSlate, TaalPart } from 'taal-editor';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-icu-expression-editor',
  templateUrl: './icu-expression-editor.component.html',
  styleUrls: ['./icu-expression-editor.component.less']
})
export class IcuExpressionEditorComponent implements OnInit {

  @Input() case: any;
  @Input() caseSave$: Observable<void>;
  @Output() icuExpressionEditComplete: EventEmitter<{ key: string, target: TaalPart[] }> = new EventEmitter();

  taalEditorActionDispatcher: Subject<{ id: string, action: string, data: any }> = new Subject();
  draft: any;

  missingPlaceholders: any[] = [];
  
  ngUnsubscribe = new Subject<void>();

  constructor() { }

  ngOnInit() {
    this.caseSave$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => {
        this.saveEdit();
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  startEdit(event: any): void {
    
  }

  taalEditorChange(event: any) {
    this.draft = event.value;
    this.updateMissingPlaceholders();
  }

  addPlaceholder(placeholder: any) {
    this.taalEditorActionDispatcher.next({
      id: this.case.key,
      action: 'ADD_PLACEHOLDER',
      data: { key: placeholder.key, value: placeholder.value }
    });
    this.updateMissingPlaceholders();
  }

  updateMissingPlaceholders() {
    let targetParts = convertFromSlate(this.draft);
    let sourcePlaceholders = this.case.validationParts.filter(_ => _.type === 'PLACEHOLDER');
    let targetPlaceholders = targetParts.parts.filter(_ => _.type === 'PLACEHOLDER');
    let index = 0;

    const missingPlaceholders = [];
    while (index < sourcePlaceholders.length) {
      const currentValue = sourcePlaceholders[index].value;
      const sourcePlaceholdersCount = sourcePlaceholders.filter(_ => _.value === currentValue).length;
      const targetPlaceholdersCount = targetPlaceholders.filter(_ => _.value === currentValue).length;
      const missingPlaceholdersCount = missingPlaceholders.filter(_ => _.value === currentValue).length
      const countDiff = sourcePlaceholdersCount - targetPlaceholdersCount;

      if (countDiff > missingPlaceholdersCount) missingPlaceholders.push(sourcePlaceholders[index]);
      index++;
    }

    this.missingPlaceholders = missingPlaceholders;
  }

  saveEdit(): void {

    if (!this.draft) return this.icuExpressionEditComplete.emit(null);
    let targetParts = convertFromSlate(this.draft);
    this.icuExpressionEditComplete.emit({
      key: this.case.key,
      target: targetParts.parts || []
    })
  }

}
