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
import { NgxsModule } from '@ngxs/store';
import { TranslationsState } from './state/translations.state';
import { TranslationFileLoadedGuard } from '../shared/guards/translation-file-loaded.guard';

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

    NgxsModule.forFeature([TranslationsState]),

    RouterModule.forRoot([
      {
        path: '',
        component: LayoutComponent,
        children: [
          { path: '', redirectTo: 'translation-files/upload', pathMatch: 'full' },

          { path: 'translation-files/upload', loadChildren: '../upload-translation-file/upload-translation-file.module#UploadTranslationFileModule' },
          { path: 'applications', loadChildren: '../applications/applications.module#ApplicationsModule' },
          { path: 'translation-files', loadChildren: '../translation-files/translation-files.module#TranslationFilesModule' },
          { path: 'translations', loadChildren: '../translations/translations.module#TranslationsModule', canActivate: [TranslationFileLoadedGuard] },
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
