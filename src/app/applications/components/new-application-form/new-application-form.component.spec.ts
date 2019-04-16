import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApplicationFormComponent } from './new-application-form.component';

describe('NewApplicationFormComponent', () => {
  let component: NewApplicationFormComponent;
  let fixture: ComponentFixture<NewApplicationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewApplicationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
