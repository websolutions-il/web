import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistraionLogInPageComponent } from './registraion-log-in-page.component';

describe('RegistraionLogInPageComponent', () => {
  let component: RegistraionLogInPageComponent;
  let fixture: ComponentFixture<RegistraionLogInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistraionLogInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistraionLogInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
