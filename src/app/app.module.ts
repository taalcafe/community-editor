import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US, NZ_ICON_DEFAULT_TWOTONE_COLOR, NZ_ICONS } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { IconDefinition } from '@ant-design/icons-angular';
import { DownloadOutline, FileTextOutline, EditOutline, MessageOutline, ProfileOutline, BellOutline, FlagOutline, BarsOutline, TableOutline, PlusOutline } from '@ant-design/icons-angular/icons';
import { GraphQLModule } from './graphql.module';
registerLocaleData(en);


// Every Icon you use should be imported individually to keep the bundle size low
const icons: IconDefinition[] = [
  EditOutline,
  DownloadOutline,
  FileTextOutline,
  MessageOutline,
  ProfileOutline,
  BellOutline,
  FlagOutline,
  BarsOutline,
  TableOutline,
  PlusOutline
];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    CoreModule,
    SharedModule,
    GraphQLModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },

    // Icons Static Load
    { provide: NZ_ICON_DEFAULT_TWOTONE_COLOR, useValue: '#00ff00' }, // If not provided, Ant Design's official blue would be used
    { provide: NZ_ICONS, useValue: icons },
    // Icons Static End
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
