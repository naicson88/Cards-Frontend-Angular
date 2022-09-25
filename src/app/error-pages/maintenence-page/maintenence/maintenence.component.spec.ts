import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenenceComponent } from './maintenence.component';

describe('MaintenenceComponent', () => {
  let component: MaintenenceComponent;
  let fixture: ComponentFixture<MaintenenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
