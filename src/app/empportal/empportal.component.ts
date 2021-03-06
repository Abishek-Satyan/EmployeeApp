import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

function ageValidator(control:AbstractControl):{[key:string]:boolean}|null{
  if(control.value<18){
    return{
      "under18":true
    }
    
  }
  return null
}

@Component({
  selector: 'app-empportal',
  templateUrl: './empportal.component.html',
  styleUrls: ['./empportal.component.css']
})

export class EmpportalComponent implements OnInit {
 
  showForm=false
  maxdate=new Date()
  edit:boolean=false
  buttonStatus=false
  interesterror=false
  languageserror=false
  selectedfile:any
  fileUploadStatus=false
  filename:String=""
  fileerror=false
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
  empid:number=0
  employeeForm=this.fb.group({
    ename:['',[Validators.required]],
    age:['',[Validators.required,ageValidator]],
    gender:['',[Validators.required]],
    joindate:['',[Validators.required]],
    file:['']
  })
 
  constructor(private fb:FormBuilder,private http:HttpClient) {this.displaydata() }

  ngOnInit(): void {
  }
  
  popupForm(){
    this.showForm=!this.showForm
    this.edit=false
    this.buttonStatus=false
    if(this.empdetails.length>0){
      this.empid=(this.empdetails[this.empdetails.length-1].empid)+1
    }
    
    console.log(this.empid)
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
    const empid=this.empid
    const ename=this.employeeForm.value.ename;
    const age=this.employeeForm.value.age;
    const gender=this.employeeForm.value.gender;
    const joindate=this.employeeForm.value.joindate;
    const interests=this.interestSelected;
    const languages=this.languages;
    const filename=this.filename
    if((interests.length<4)||(languages.length<1)){
      if(interests.length<4){
        this.interesterror=true
      }
      else if(languages.length<1){
        this.languageserror=true
      }
    }
    else{
      this.interesterror=false
      this.languageserror=false
      const data={
        empid,
        ename,
        age,
        gender,
        joindate,
        interests,
        languages,
        filename 
      }
     
      
      if(this.employeeForm.valid){
        this.buttonStatus=true
        if(!this.edit){
          if(this.fileUploadStatus){
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
          else{
            this.fileerror=true
          }
        }
        else{
          this.http.post("http://localhost:3000/edit",data).subscribe((result:any)=>{
            if(result){
              this.popupForm()
              window.location.reload()
              alert("Employee Details Edited")
            }
          },(result:any)=>{
            window.location.reload()
            alert(result.error.message)
          })
        }
        } 
    }
   
   
    
    
  }
  displaydata(){
    this.http.post("http://localhost:3000/getdata","").subscribe((result:any)=>{
      if(result){
        this.empdetails=result.data
        for(let emp of this.empdetails){
         emp.interests=emp.interests.map((e:any)=>e.interest).join(",")
         emp.languages=emp.languages.map((e:any)=>e.language).join(",")
        }
      if(this.empdetails.length<1){
        this.empid=1
      }
      else{
        this.empid=(this.empdetails[this.empdetails.length-1].empid)+1
      }
       
      }
    })
   
  }
  getData(event:any){
  this.languages=event
  this.buttonStatus=true
  }
 
 editData(employee:any){
 console.log(employee);
 this.edit=true
 this.employeeForm.get('ename')?.setValue(employee.ename)
 this.employeeForm.get('age')?.setValue(employee.age)
 this.employeeForm.get('gender')?.setValue(employee.gender)
 this.employeeForm.get('joindate')?.setValue(employee.joindate)
 this.showForm=true
 this.empid=employee.empid
 
 console.log(this.empid)
 }
 deleteData(empid:Number){
 const data={
   empid
 }
 this.http.post("http://localhost:3000/deletedata",data).subscribe((result:any)=>{
   if(result){
    alert("Employee Details Deleted")
    window.location.reload()
   
   }
 })
 }
 cancel(){
   window.location.reload()
 }
 fileSelection(event:any){
   this.selectedfile=event.target.files[0]
   console.log(this.selectedfile);
 }
 upload(){
   const allowedtypes="application/pdf"
   
   if(this.selectedfile && this.selectedfile.type==allowedtypes){
    const formData=new FormData()
    formData.append('file',this.selectedfile)
    this.http.post("http://localhost:3000/uploadFile",formData).subscribe((result:any)=>{
      this.filename=result.filename
      this.fileUploadStatus=true
    })
   }
   else if(!(this.selectedfile)){
    alert("please chose a file to upload")
   }
   else{
     alert("unsupported file format")
   }
   
   
 }
 downloadcv(employee:any){
   console.log(employee.filename);
   const filename=employee.filename
  
   window.open("http://localhost:3000/download/"+filename)
 }
}
