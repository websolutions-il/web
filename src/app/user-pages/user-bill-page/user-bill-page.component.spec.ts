import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBillPageComponent } from './user-bill-page.component';

describe('UserBillPageComponent', () => {
  let component: UserBillPageComponent;
  let fixture: ComponentFixture<UserBillPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBillPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBillPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
