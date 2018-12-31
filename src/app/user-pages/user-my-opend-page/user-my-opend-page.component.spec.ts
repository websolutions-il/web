import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMyOpendPageComponent } from './user-my-opend-page.component';

describe('UserMyOpendPageComponent', () => {
  let component: UserMyOpendPageComponent;
  let fixture: ComponentFixture<UserMyOpendPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMyOpendPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMyOpendPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
