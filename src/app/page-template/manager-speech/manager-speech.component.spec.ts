import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerSpeechComponent } from './manager-speech.component';

describe('ManagerSpeechComponent', () => {
  let component: ManagerSpeechComponent;
  let fixture: ComponentFixture<ManagerSpeechComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerSpeechComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerSpeechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
