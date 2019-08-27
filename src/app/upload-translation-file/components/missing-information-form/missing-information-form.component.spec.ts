import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingInformationFormComponent } from './missing-information-form.component';

describe('MissingInformationFormComponent', () => {
  let component: MissingInformationFormComponent;
  let fixture: ComponentFixture<MissingInformationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingInformationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
