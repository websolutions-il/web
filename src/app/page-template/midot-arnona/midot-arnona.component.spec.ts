import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidotArnonaComponent } from './midot-arnona.component';

describe('MidotArnonaComponent', () => {
  let component: MidotArnonaComponent;
  let fixture: ComponentFixture<MidotArnonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidotArnonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidotArnonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
