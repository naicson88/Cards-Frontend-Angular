import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSetcollectionComponent } from './user-setcollection.component';

describe('UserSetcollectionComponent', () => {
  let component: UserSetcollectionComponent;
  let fixture: ComponentFixture<UserSetcollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSetcollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSetcollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
