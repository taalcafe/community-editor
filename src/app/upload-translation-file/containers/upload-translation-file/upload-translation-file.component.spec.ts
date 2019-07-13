import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTranslationFileComponent } from './upload-translation-file.component';

describe('UploadTranslationFileComponent', () => {
  let component: UploadTranslationFileComponent;
  let fixture: ComponentFixture<UploadTranslationFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadTranslationFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTranslationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
