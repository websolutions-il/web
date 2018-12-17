import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPointsOfIntrestPageComponent } from './user-points-of-intrest-page.component';

describe('UserPointsOfIntrestPageComponent', () => {
  let component: UserPointsOfIntrestPageComponent;
  let fixture: ComponentFixture<UserPointsOfIntrestPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPointsOfIntrestPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPointsOfIntrestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
