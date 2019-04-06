import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './containers/applications/applications.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ApplicationsComponent],
  imports: [
    CommonModule,

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
