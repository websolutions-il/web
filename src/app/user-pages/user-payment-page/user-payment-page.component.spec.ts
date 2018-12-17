import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentPageComponent } from './user-payment-page.component';

describe('UserPaymentPageComponent', () => {
  let component: UserPaymentPageComponent;
  let fixture: ComponentFixture<UserPaymentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPaymentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
