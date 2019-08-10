import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcuExpressionEditorComponent } from './icu-expression-editor.component';

describe('IcuExpressionEditorComponent', () => {
  let component: IcuExpressionEditorComponent;
  let fixture: ComponentFixture<IcuExpressionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcuExpressionEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcuExpressionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
