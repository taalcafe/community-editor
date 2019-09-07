import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './containers/privacy-policy/privacy-policy.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,

    RouterModule.forChild([
      {
        path: '',
        component: PrivacyPolicyComponent,
        children: [ ]
      }
    ])
  ]
})
export class PrivacyPolicyModule { }
