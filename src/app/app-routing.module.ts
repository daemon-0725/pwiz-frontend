import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router'

import { LoginComponent } from './login/login.component';
import { InputComponent } from './input/input.component';
import { AdminComponent } from './admin/admin.component';

const routes : Routes = 
  [{path: 'login', component: LoginComponent},
    {path: 'home', component: InputComponent},
    {path: 'admin', component: AdminComponent},
    {path: '', redirectTo : 'login', pathMatch: 'full'},
    {path: '**', redirectTo: 'login'}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
