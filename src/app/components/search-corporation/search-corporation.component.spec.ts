import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCorporationComponent } from './search-corporation.component';

describe('SearchCorporationComponent', () => {
  let component: SearchCorporationComponent;
  let fixture: ComponentFixture<SearchCorporationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCorporationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCorporationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
