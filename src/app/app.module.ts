import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module'

import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select'
import {MatButtonModule} from '@angular/material/button'
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatListModule} from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase, AngularFireDatabaseModule} from '@angular/fire/database'
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from '../environments/environment';


import { LoginComponent } from './login/login.component'
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { AngFireService } from './ang-fire.service';


@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    LoginComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatSnackBarModule,
    AppRoutingModule,
    AngularFireDatabaseModule,
    MatRadioModule,
    MatListModule,
    MatTabsModule,
    MatProgressBarModule
  ],
  providers: [AngularFireDatabase,
              AngFireService,AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
