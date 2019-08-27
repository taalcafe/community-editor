import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UploadTranslationFileComponent } from './containers/upload-translation-file/upload-translation-file.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from '../shared/shared.module';
import { MissingInformationFormComponent } from './components/missing-information-form/missing-information-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UploadTranslationFileComponent, MissingInformationFormComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

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
