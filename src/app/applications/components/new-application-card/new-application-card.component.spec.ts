import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApplicationCardComponent } from './new-application-card.component';

describe('NewApplicationCardComponent', () => {
  let component: NewApplicationCardComponent;
  let fixture: ComponentFixture<NewApplicationCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewApplicationCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewApplicationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
