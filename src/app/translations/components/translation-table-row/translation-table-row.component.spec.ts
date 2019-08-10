import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationTableRowComponent } from './translation-table-row.component';

describe('TranslationTableRowComponent', () => {
  let component: TranslationTableRowComponent;
  let fixture: ComponentFixture<TranslationTableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationTableRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
