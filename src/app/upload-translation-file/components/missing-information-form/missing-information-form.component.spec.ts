import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingInformationFormComponent } from './missing-information-form.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MissingInformationFormComponent', () => {
  let component: MissingInformationFormComponent;
  let fixture: ComponentFixture<MissingInformationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingInformationFormComponent ],
      imports: [ NgZorroAntdModule, FormsModule, BrowserAnimationsModule ]
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
