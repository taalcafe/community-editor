import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaalEditorComponent } from './taal-editor.component';

describe('TaalEditorComponent', () => {
  let component: TaalEditorComponent;
  let fixture: ComponentFixture<TaalEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaalEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaalEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
