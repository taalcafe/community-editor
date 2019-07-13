import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UploadTranslationFileComponent } from './containers/upload-translation-file/upload-translation-file.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UploadTranslationFileComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,

    RouterModule.forChild([
      {
        path: '',
        component: UploadTranslationFileComponent,
        children: [ ]
      }
    ])
  ]
})
export class UploadTranslationFileModule { }
