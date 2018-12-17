import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessBillToMaiLComponent } from './success-bill-to-mai-l.component';

describe('SuccessBillToMaiLComponent', () => {
  let component: SuccessBillToMaiLComponent;
  let fixture: ComponentFixture<SuccessBillToMaiLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessBillToMaiLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessBillToMaiLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
