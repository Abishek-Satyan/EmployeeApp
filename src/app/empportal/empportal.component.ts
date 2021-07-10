import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-empportal',
  templateUrl: './empportal.component.html',
  styleUrls: ['./empportal.component.css']
})

export class EmpportalComponent implements OnInit {
 
  showForm=false
  maxdate=new Date()
  
  interestData=[
    {interest:"Development",isChecked:false},
    {interest:"Product Design",isChecked:false},
    {interest:"Planning",isChecked:false},
    {interest:"Team Management",isChecked:false},
    {interest:"Marketing",isChecked:false},
    {interest:"Support",isChecked:false},
  ]
  languages=[{}]
  interestSelected=[{}]
  empdetails:any=[]
  interestCount=0;
  employeeForm=this.fb.group({
    ename:[''],
    age:[''],
    gender:[''],
    joindate:['']
  })
  constructor(private fb:FormBuilder,private http:HttpClient) {this.displaydata() }

  ngOnInit(): void {
  }
  popupForm(){
    this.showForm=!this.showForm
  }
  getInterest(e:any,interests:any){
  if(e.target.checked===true){
   if(this.interestCount<4){
    interests.isChecked=true
     this.interestCount++;
   }
   else{
    e.target.checked=false
   }
  }
  else{
    this.interestCount--;
    interests.isChecked=false
  } 
  this.interestSelected=this.interestData.filter(x=>(x.isChecked==true))
  console.log(this.interestSelected);
  
  }
  submit(){
    const ename=this.employeeForm.value.ename;
    const age=this.employeeForm.value.age;
    const gender=this.employeeForm.value.gender;
    const joindate=this.employeeForm.value.joindate;
    const interests=this.interestSelected;
    const languages=this.languages;
    const data={
      ename,
      age,
      gender,
      joindate,
      interests,
      languages
    }
    this.http.post("http://localhost:3000/submit",data).subscribe((result:any)=>{
      if(result){
        this.popupForm()
        window.location.reload()
        alert("Employee Details added")
      }
    },(result:any)=>{
      window.location.reload()
      alert(result.error.message)
    })
    
  }
  displaydata(){
    this.http.post("http://localhost:3000/getdata","").subscribe((result:any)=>{
      if(result){
        this.empdetails=result.data
        for(let emp of this.empdetails){
         emp.interests=emp.interests.map((e:any)=>e.interest).join(",")
         emp.languages=emp.languages.map((e:any)=>e.language).join(",")
        }
       console.log(this.empdetails);
       
      }
    })
   
  }
  getData(event:any){
  this.languages=event
  }
 
 
}
