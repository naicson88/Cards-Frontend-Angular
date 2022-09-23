import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddCardDeckComponent } from './admin-add-card-deck.component';

describe('AdminAddCardDeckComponent', () => {
  let component: AdminAddCardDeckComponent;
  let fixture: ComponentFixture<AdminAddCardDeckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAddCardDeckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddCardDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
