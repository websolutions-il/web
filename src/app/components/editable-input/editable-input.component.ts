import { Component, OnInit, Input, ViewChild, ElementRef, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-editable-input',
  templateUrl: './editable-input.component.html',
  styleUrls: ['./editable-input.component.css']
})
export class EditableInputComponent{
  @Input() inputValue: string;
  @Output() saveData = new EventEmitter();
  @ViewChild('input') input: ElementRef;

  result:string;
  inputStyle:string;
  disabledInput:boolean = true;
  constructor(private sanitizer: DomSanitizer) { }

  enableEditing(){
    this.disabledInput = false;
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 10); 
  }
  disableEditing(){
    this.disabledInput = true;
    this.saveData.emit(this.inputValue);
  } 
}
