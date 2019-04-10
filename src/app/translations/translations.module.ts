import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationsComponent } from './containers/translations/translations.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { TranslationEditComponent } from './components/translation-edit/translation-edit.component';
import { TranslationsTableComponent } from './containers/translations-table/translations-table.component';
import { TranslationsModernComponent } from './containers/translations-modern/translations-modern.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TranslationsComponent, TranslationEditComponent, TranslationsTableComponent, TranslationsModernComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule.forChild([
      {
        path: ':id',
        component: TranslationsComponent,
        children: [ ]
      }
    ])
  ]
})
export class TranslationsModule { }
