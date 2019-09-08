import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './containers/landing-page/landing-page.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { BannerComponent } from './components/banner/banner.component';
import { HowToUseComponent } from './components/how-to-use/how-to-use.component';
import { UploadTranslationFileModule } from '../upload-translation-file/upload-translation-file.module';

@NgModule({
  declarations: [LandingPageComponent, FeaturesSectionComponent, BannerComponent, HowToUseComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,

    RouterModule.forChild([
      {
        path: '',
        component: LandingPageComponent,
        children: [ ]
      }
    ]),

    UploadTranslationFileModule
  ]
})
export class LandingModule { }
