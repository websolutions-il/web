import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMyDocumentsPageComponent } from './user-my-documents-page.component';

describe('UserMyDocumentsPageComponent', () => {
  let component: UserMyDocumentsPageComponent;
  let fixture: ComponentFixture<UserMyDocumentsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMyDocumentsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMyDocumentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
