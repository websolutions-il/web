import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentsPageComponent } from './user-payments-page.component';

describe('UserPaymentsPageComponent', () => {
  let component: UserPaymentsPageComponent;
  let fixture: ComponentFixture<UserPaymentsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPaymentsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
