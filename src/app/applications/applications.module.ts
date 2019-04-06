import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './containers/applications/applications.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ApplicationCardComponent } from './components/application-card/application-card.component';

@NgModule({
  declarations: [ApplicationsComponent, ApplicationCardComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,

    RouterModule.forChild([
      {
        path: '',
        component: ApplicationsComponent,
        children: [ ]
      }
    ])
  ]
})
export class ApplicationsModule { }
