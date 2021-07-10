import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpportalComponent } from './empportal/empportal.component';

const routes: Routes = [
  {path:'',component:EmpportalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
