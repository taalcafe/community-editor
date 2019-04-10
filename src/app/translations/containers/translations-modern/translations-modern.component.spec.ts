import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationsModernComponent } from './translations-modern.component';

describe('TranslationsModernComponent', () => {
  let component: TranslationsModernComponent;
  let fixture: ComponentFixture<TranslationsModernComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationsModernComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationsModernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
