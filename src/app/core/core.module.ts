import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './containers/navbar/navbar.component';
import { LayoutComponent } from './containers/layout/layout.component';
import { LoadingBarComponent } from './containers/loading-bar/loading-bar.component';
import { ErrorUnauthenticatedComponent } from './containers/errors/error-unauthenticated/error-unauthenticated.component';
import { ErrorUnauthorizedComponent } from './containers/errors/error-unauthorized/error-unauthorized.component';
import { ErrorNotFoundComponent } from './containers/errors/error-not-found/error-not-found.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    NavbarComponent,
    LayoutComponent,
    LoadingBarComponent,
    ErrorUnauthenticatedComponent,
    ErrorUnauthorizedComponent,
    ErrorNotFoundComponent
  ],
  imports: [
    NgZorroAntdModule,
    CommonModule,
    SharedModule,

    RouterModule.forRoot([
      {
        path: '',
        component: LayoutComponent,
        children: [
          { path: '', redirectTo: 'applications', pathMatch: 'full' },

          { path: 'applications', loadChildren: '../applications/applications.module#ApplicationsModule' },
        ]
      },

      { path: '401', component: ErrorUnauthenticatedComponent },
      { path: '403', component: ErrorUnauthorizedComponent },
      { path: '404', component: ErrorNotFoundComponent },
      { path: '**', component: ErrorNotFoundComponent }
    ], { scrollPositionRestoration: 'enabled' }),
  ]
})
export class CoreModule { }
