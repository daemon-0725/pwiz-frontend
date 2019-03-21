import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class AngFireService {
  static afAuth : AngularFireAuth = null;

  constructor(afAuth: AngularFireAuth,
              private db : AngularFireDatabase) { 
                if(AngFireService.afAuth === null){AngFireService.afAuth = afAuth; console.log("Instantiated")}
              }

  addCompany (company: string, email: string, password: string, desc:string) : boolean {
    //this.db.list('/Companies').push({'name': company, 'desc':desc});
    AngFireService.afAuth.auth.createUserWithEmailAndPassword(email,password).then(code => {
      //console.log(code.user.displayName)
      if (code != null) {
        code.user.updateProfile({
          displayName: company,
          photoURL:  null
        })
        return true;
      }
      
    })
    .catch (function(error) {
        alert(error.message)
    })
    console.log(AngFireService.afAuth.auth.currentUser.displayName);
    
    return false;
  }

  companyName ():string {
    return AngFireService.afAuth.auth.currentUser.displayName
  }

}
