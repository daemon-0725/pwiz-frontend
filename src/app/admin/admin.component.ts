import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  afAuth : AngularFireAuth = null;
  constructor(private db: AngularFireDatabase, 
              private router: Router,
              private snackBar : MatSnackBar,
              afAuth : AngularFireAuth) {
                this.afAuth = afAuth;
              }

fields = ['Front End','Back End','Full Stack','Cloud', 'Data Science', 'Database', 'Machine Learning', 'Security','Marketing','Mobile']
companys : Observable<any[]>;
logged : boolean = false;
loading = false;
public ref = null; 

  ngOnInit() {
    this.db.list('/Admin').valueChanges().subscribe(item => {
      if (item[1] == true) {
        this.logged = true;
      }
      else{
        this.logged = false;
      }
    })
    this.companys = this.db.list("/Companies").snapshotChanges();
  }

  ngOnDestroy() {
    this.db.list('/').update('Admin',{'logged':false})
  }

  addCompany (company: string, email: string, password: string, desc:string, imgurl : string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email,password).then(code => {
      //console.log(code.user.displayName)
      if (code != null) {
        code.user.updateProfile({
          displayName: company,
          photoURL:  null
        })
        this.db.list('/Companies/'+company).set('desc',desc);
        this.db.list('/Companies/'+company).set('url',imgurl);
        this.openSnackBar('Recruiter added successfully');
        this.afAuth.auth.signOut();
      }
      
    })
    .catch (function(error) {
      alert(error.message);
    })
  }

  /*removeCompany(company_name) {
    //console.log(firebase.database().ref('Companies').orderByChild('name').equalTo('TCS'))
    this.db.list('/Companies').snapshotChanges().subscribe (val => {
      val.map (compa => {
        if (compa.payload.child('name').val() === company_name){
          this.db.list('/Companies').remove(compa.key);
          this.removeFields(company_name)
        }
      }
      )
    })
  }*/

  logout () {
    this.loading = true;
    this.db.list('/').update('Admin',{'logged':false}).then(bye => {
    this.router.navigateByUrl('/login');
    })
  }

  public removeFields(company) {
    for (let i=0;i<this.fields.length;i++) 
      for (let lvl of ['H', 'M', 'L']) {
        this.db.list("/Field_names/"+this.fields[i]+"/"+lvl).snapshotChanges().subscribe(item => {
          item.map(val => {
            if(val.key === company)
                this.db.list("/Field_names/"+this.fields[i]+"/"+lvl).remove(val.key);
          })
        });
      }
  }

  public openSnackBar(message: string) {
    this.snackBar.open( message,null,  {
      duration: 1000
    });
  }

}