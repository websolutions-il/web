import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMidotArnonaPageComponent } from './user-midot-arnona-page.component';

describe('UserMidotArnonaPageComponent', () => {
  let component: UserMidotArnonaPageComponent;
  let fixture: ComponentFixture<UserMidotArnonaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMidotArnonaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMidotArnonaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
