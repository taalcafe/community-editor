import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaalEditorComponent } from './components/taal-editor/taal-editor.component';
import { EllipsisDirective } from './directives/ellipsis.directive';

@NgModule({
  declarations: [TaalEditorComponent, EllipsisDirective],
  imports: [
    CommonModule
  ],
  exports: [TaalEditorComponent, EllipsisDirective]
})
export class SharedModule { }
