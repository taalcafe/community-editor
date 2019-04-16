import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './containers/applications/applications.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ApplicationCardComponent } from './components/application-card/application-card.component';
import { NewApplicationCardComponent } from './components/new-application-card/new-application-card.component';
import { NewApplicationFormComponent } from './components/new-application-form/new-application-form.component';

@NgModule({
  declarations: [ApplicationsComponent, ApplicationCardComponent, NewApplicationCardComponent, NewApplicationFormComponent],
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
