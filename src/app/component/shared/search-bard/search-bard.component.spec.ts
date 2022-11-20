import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBardComponent } from './search-bard.component';

describe('SearchBardComponent', () => {
  let component: SearchBardComponent;
  let fixture: ComponentFixture<SearchBardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
