import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationFilesComponent } from './components/translation-files/translation-files.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TranslationFilesComponent],
  imports: [
    CommonModule,

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
