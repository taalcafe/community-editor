import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaalEditorComponent } from './components/taal-editor/taal-editor.component';

@NgModule({
  declarations: [TaalEditorComponent],
  imports: [
    CommonModule
  ],
  exports: [TaalEditorComponent]
})
export class SharedModule { }
