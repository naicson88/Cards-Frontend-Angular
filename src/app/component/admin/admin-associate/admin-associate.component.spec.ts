import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAssociateComponent } from './admin-associate.component';

describe('AdminAssociateComponent', () => {
  let component: AdminAssociateComponent;
  let fixture: ComponentFixture<AdminAssociateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAssociateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAssociateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
