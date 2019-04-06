import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './containers/navbar/navbar.component';
import { LayoutComponent } from './containers/layout/layout.component';
import { LoadingBarComponent } from './containers/loading-bar/loading-bar.component';

@NgModule({
  declarations: [NavbarComponent, LayoutComponent, LoadingBarComponent],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
