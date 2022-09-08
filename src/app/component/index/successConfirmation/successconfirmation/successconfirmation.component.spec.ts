import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessconfirmationComponent } from './successconfirmation.component';

describe('SuccessconfirmationComponent', () => {
  let component: SuccessconfirmationComponent;
  let fixture: ComponentFixture<SuccessconfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessconfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessconfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
