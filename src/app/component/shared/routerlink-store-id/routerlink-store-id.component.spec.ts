import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterlinkStoreIdComponent } from './routerlink-store-id.component';

describe('RouterlinkStoreIdComponent', () => {
  let component: RouterlinkStoreIdComponent;
  let fixture: ComponentFixture<RouterlinkStoreIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterlinkStoreIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterlinkStoreIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
