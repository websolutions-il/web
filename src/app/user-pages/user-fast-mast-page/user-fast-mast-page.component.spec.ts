import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFastMastPageComponent } from './user-fast-mast-page.component';

describe('UserFastMastPageComponent', () => {
  let component: UserFastMastPageComponent;
  let fixture: ComponentFixture<UserFastMastPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFastMastPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFastMastPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
