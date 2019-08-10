import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationsComponent } from './containers/translations/translations.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { TranslationsTableComponent } from './containers/translations-table/translations-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { IcuExpressionEditorComponent } from './components/icu-expression-editor/icu-expression-editor.component';
import { TranslationTableRowComponent } from './components/translation-table-row/translation-table-row.component';
import { TargetTranslationExtra } from './components/target-translation-extra/target-translation-extra.component';

@NgModule({
  declarations: [TranslationsComponent, TranslationsTableComponent, IcuExpressionEditorComponent, TranslationTableRowComponent, TargetTranslationExtra],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule.forChild([
      {
        path: '',
        component: TranslationsComponent,
        children: [ ]
      }
    ]),

    SharedModule
  ]
})
export class TranslationsModule { }
