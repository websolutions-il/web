import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillInMailComponent } from './bill-in-mail.component';

describe('BillInMailComponent', () => {
  let component: BillInMailComponent;
  let fixture: ComponentFixture<BillInMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillInMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillInMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
