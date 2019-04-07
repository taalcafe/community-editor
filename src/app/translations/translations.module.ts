import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationsComponent } from './containers/translations/translations.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { TranslationEditComponent } from './components/translation-edit/translation-edit.component';

@NgModule({
  declarations: [TranslationsComponent, TranslationEditComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,

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
