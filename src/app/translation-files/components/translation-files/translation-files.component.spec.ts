import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationFilesComponent } from './translation-files.component';

describe('TranslationFilesComponent', () => {
  let component: TranslationFilesComponent;
  let fixture: ComponentFixture<TranslationFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
