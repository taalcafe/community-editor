import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITaalIcuMessage } from 'src/app/upload-translation-file/models/taal-icu-message';

@Component({
  selector: 'app-target-translation-extra',
  templateUrl: './target-translation-extra.component.html',
  styleUrls: ['./target-translation-extra.component.less']
})
export class TargetTranslationExtra implements OnInit, OnDestroy {

  @Input() translationId: string;
  @Input() icuExpressionTree: any;
  @Input() taalEditorActionDispatcher: Subject<{ id: string, action: string, data: any }>;
  @Input() save$: Observable<void>;

  @Input() missingPlaceholders: any[];
  @Input() missingICUExpressions: ITaalIcuMessage[];

  @Output() updateMissingPlaceholders: EventEmitter<void> = new EventEmitter();
  @Output() updateMissingICUExpressions: EventEmitter<void> = new EventEmitter();
  @Output() updateICUExpressions: EventEmitter<void> = new EventEmitter();

  caseSave: Subject<{ key: string }> = new Subject();

  ngUnsubscribe = new Subject<void>();

  caseCount: number = 0;
  caseUpdatedCount: number = 0;

  constructor() { }

  ngOnInit() {
    this.save$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => {

        let caseCount = 0
        if (this.icuExpressionTree) 
          this.icuExpressionTree.forEach(_ => caseCount += _.cases.length);
        
        this.caseCount = caseCount;
        this.caseUpdatedCount = 0;
        
        this.caseSave.next();
      })
  }

  ngOnDestroy() {}

  addICUExpression(icuExpression: any) {
    this.taalEditorActionDispatcher.next({
      id: this.translationId,
      action: 'ADD_ICU_MESSAGE_REF',
      data: { key: icuExpression.id, value: `<ICU-Message-Ref_${icuExpression.key}/>` }
    });
    this.updateMissingICUExpressions.emit();
  }

  addPlaceholder(placeholder: any) {
    this.taalEditorActionDispatcher.next({
      id: this.translationId,
      action: 'ADD_PLACEHOLDER',
      data: { key: placeholder.key, value: placeholder.value }
    });
    this.updateMissingPlaceholders.emit();
  }

  icuExpressionEditComplete(payload: any, icuExpressionIndex: number, icuCase: any) {
    this.caseUpdatedCount++;
    if (payload) {
      const matchingIcuCase = this.icuExpressionTree[icuExpressionIndex].cases.find(_ => _.key === icuCase.key);
      if (matchingIcuCase) {
        matchingIcuCase.parts = payload.target;
      }
    }
    
    if (this.caseCount === this.caseUpdatedCount)
      this.updateICUExpressions.emit(this.icuExpressionTree);

  }

}
