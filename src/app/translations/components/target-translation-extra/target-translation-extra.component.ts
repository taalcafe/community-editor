import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'apollo-link';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-target-translation-extra',
  templateUrl: './target-translation-extra.component.html',
  styleUrls: ['./target-translation-extra.component.less']
})
export class TargetTranslationExtra implements OnInit {

  @Input() editCache: any;
  @Input() taalEditorActionDispatcher: Subject<{ id: string, action: string, data: any }>;

  @Output() updateMissingPlaceholders: EventEmitter<void> = new EventEmitter();
  @Output() updateMissingICUExpressions: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  addICUExpression(icuExpression: any) {
    this.taalEditorActionDispatcher.next({
      id: this.editCache.data.translationId,
      action: 'ADD_ICU_MESSAGE_REF',
      data: { key: icuExpression.id, value: `<ICU-Message-Ref_${icuExpression.key}/>` }
    });
    this.updateMissingICUExpressions.emit();
  }

  addPlaceholder(placeholder: any) {
    this.taalEditorActionDispatcher.next({
      id: this.editCache.data.translationId,
      action: 'ADD_PLACEHOLDER',
      data: { key: placeholder.key, value: placeholder.value }
    });
    this.updateMissingPlaceholders.emit();
  }

}
