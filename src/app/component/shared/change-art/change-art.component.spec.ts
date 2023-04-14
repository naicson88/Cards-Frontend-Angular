import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeArtComponent } from './change-art.component';

describe('ChangeArtComponent', () => {
  let component: ChangeArtComponent;
  let fixture: ComponentFixture<ChangeArtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeArtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
