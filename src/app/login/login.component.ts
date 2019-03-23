import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationCancel,
        NavigationEnd,
        NavigationError,
        NavigationStart,
        Event } from "@angular/router";
import { stringLength } from '@firebase/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  logged: boolean = false;
  loginType : string;
  public ref = null;
  afAuth : AngularFireAuth = null;
  loading = false;

  constructor(private router : Router, 
              private db : AngularFireDatabase,
              afAUth: AngularFireAuth) {
                localStorage.removeItem('firebase:previous_websocket_failure');
                this.afAuth = afAUth;
  }

  ngOnInit() {
    this.afAuth.auth.signOut();
  }

  ngOnDestroy() {
    //if (this.ref != null)
      //this.ref.unsubscribe();
  }

  login(email,password) {
    if(this.loginType === 'Admin') {
      this.loading = true;
      var fetched_email = null;
      var fetched_pass = null;
      this.ref = this.db.list('/Admin').snapshotChanges().subscribe(item => {
          item.map(itm => {
            if(itm.key === 'email')
              fetched_email = itm.payload.val();
            if(itm.key === 'password')
              fetched_pass = itm.payload.val();
          })
          if (fetched_email === email && fetched_pass === password) {
            this.db.list('/').update('Admin',{'logged':true}).then(lol => {
              this.ref.unsubscribe();
              this.router.navigateByUrl('/admin');
            })
          }
          else {
            this.loading = false;
            alert('Admin credentials are incorrect');
            this.ref.unsubscribe();
          }
      });
      
    }
    if (this.loginType === 'Company') {
      this.loading = true;
      this.afAuth.auth.signInWithEmailAndPassword(email,password).then(usr => {
        if(usr != null) {
          //console.log(usr.user.displayName);
          this.router.navigateByUrl('/home')
        }
      }).catch(function (error) {
        alert(error.message)
      });
    }
      

    /*if(email=="admin@gmail.com" && password=="12345")
    this.router.navigateByUrl('/login');*/
  }
}
