import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNewsPageComponent } from './user-news-page.component';

describe('UserNewsPageComponent', () => {
  let component: UserNewsPageComponent;
  let fixture: ComponentFixture<UserNewsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNewsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNewsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
