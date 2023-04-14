import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditSetComponent } from './admin-edit-set.component';

describe('AdminEditSetComponent', () => {
  let component: AdminEditSetComponent;
  let fixture: ComponentFixture<AdminEditSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
