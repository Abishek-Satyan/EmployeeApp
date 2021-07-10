import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-languageselect',
  templateUrl: './languageselect.component.html',
  styleUrls: ['./languageselect.component.css']
})

export class LanguageselectComponent implements OnInit {
  @Output() datashare=new EventEmitter;
  showBtn=true
  
  dropdownList=[{"id":1,"language":"English"},
  {"id":2,"language":"Hindi"},
  {"id":3,"language":"Malayalam"},
  {"id":4,"language":"Tamil"},
]
  selectedItems=[]
  languages=[]
  dropdownSettings:IDropdownSettings={
    singleSelection:false,
    idField:"id",
    textField:"language",
    selectAllText:"Select All",
    unSelectAllText:"Unselect All",
    allowSearchFilter:false
  }

  constructor() { }

  ngOnInit(): void {
    
  }
 display(){
   this.languages=this.selectedItems
   this.datashare.emit(this.languages)
   this.showBtn=false
   
 }
 showbtn(){
   this.showBtn=true
 }
}
