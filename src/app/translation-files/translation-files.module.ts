import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationFilesComponent } from './components/translation-files/translation-files.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [TranslationFilesComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,

    RouterModule.forChild([
      {
        path: ':id',
        component: TranslationFilesComponent,
        children: [ ]
      }
    ])
  ]
})
export class TranslationFilesModule { }
