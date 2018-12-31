import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContactCityPageComponent } from './user-contact-city-page.component';

describe('UserContactCityPageComponent', () => {
  let component: UserContactCityPageComponent;
  let fixture: ComponentFixture<UserContactCityPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserContactCityPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContactCityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
