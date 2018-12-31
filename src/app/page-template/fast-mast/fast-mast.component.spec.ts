import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastMastComponent } from './fast-mast.component';

describe('FastMastComponent', () => {
  let component: FastMastComponent;
  let fixture: ComponentFixture<FastMastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastMastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastMastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
