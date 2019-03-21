import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  logged: boolean = false;
  loginType : string;
  public ref = null;
  constructor(private router : Router, 
              private db : AngularFireDatabase,
              public afAUth: AngularFireAuth) { }

  ngOnInit() {
    this.afAUth.auth.signOut();
  }

  ngOnDestroy() {
    //if (this.ref != null)
      //this.ref.unsubscribe();
  }

  login(email,password) {
    if(this.loginType === 'Admin') {
      this.ref = this.db.list('/Admin').valueChanges().subscribe(item => {
        if (email === item[0] && password === item[2]) {
          this.db.list('/').update('Admin',{'logged':true}).then(lol => {
            this.ref.unsubscribe();
            this.router.navigateByUrl('/admin')
            console.log('1');
          })
        }
      });
      
    }
    if (this.loginType === 'Company') {
      this.afAUth.auth.signInWithEmailAndPassword(email,password).then(usr => {
        if(usr != null) {
          //console.log(usr.user.displayName);
          this.router.navigateByUrl('/home/'+usr.user.displayName)
        }
      }).catch();
    }
      

    /*if(email=="admin@gmail.com" && password=="12345")
    this.router.navigateByUrl('/login');*/
  }
}
