import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit, OnDestroy {

  fields = ['Front End','Back End','Full Stack','Cloud', 'Data Science', 'Database', 'Machine Learning', 'Security','Marketing','Mobile']
  selected_field : string;
  company_name : string;
  ctc : number;
  counter = 0;
  arr : JOBS[] = [];
  afAuth : AngularFireAuth = null;
  logged :boolean = false;
  user_ref;
  list_ref;
  imgURL;
  loading = false;

  constructor(private db: AngularFireDatabase, 
              private snackBar: MatSnackBar,
              private route : ActivatedRoute,
              private router : Router,
              afAuth : AngularFireAuth,
              private _sanitizer: DomSanitizer) {
    this.afAuth =  afAuth;

    for (let i=0;i<this.fields.length;i++) 
      for (let lvl of ['H', 'M', 'L']) {
        this.list_ref = this.db.list("/Field_names/"+this.fields[i]+"/"+lvl).snapshotChanges().subscribe(item => {
          item.map(val => {
            if(val.key === this.company_name)
                this.arr.push({ctc:Number(val.payload.val()), field: this.fields[i]})
                //console.log(this.arr);
          })
        });
      }
  }

  ngOnInit() {
    if (this.afAuth.auth.currentUser != null)
      this.logged = true;
    else
      this.logged = false;

    this.user_ref = this.afAuth.user.subscribe(user => {    
      this.company_name = user.displayName;
      if(this.company_name != undefined)
      this.db.list('/Companies/'+this.company_name).valueChanges().subscribe(item => {
        this.imgURL = item[1];
      })
    })
  }

  ngOnDestroy() {
    this.list_ref.unsubscribe();
    this.user_ref.unsubscribe();
  }

  setImage() {
    return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(rgba(29, 29, 29, 0), rgba(16, 16, 23, 0.5)), url(${this.imgURL})`)
  }

  submit( CTC: string, field : string) {
    if (CTC === '' || field === '' ) {  
      this.openSnackBar('Please fill valid data');
      return;
    }
    console.log(this.company_name + " " + ctc)
    var ctc = Number(CTC);
    var lvl : string;
    if(ctc > 5.5) {
      lvl = 'H';
    }
    else if (ctc > 3.5) {
      lvl = 'M';
    }
    else {
      lvl = 'L';
    }
    this.loading = true;
    this.db.list("/Field_names/"+field+'/'+lvl).set(this.company_name, ctc).then(lol => {
      this.loading = false;
      this.openSnackBar('The entry has been submitted successfully!')
    })
  }

  removePost(field : string, ctc : number) {
    var lvl : string;
    if(ctc > 5.5) {lvl = 'H';}
    else if (ctc > 3.5) {lvl = 'M';}
    else {lvl = 'L';}
    var del_ref = this.db.list('/Field_names/'+field+'/'+lvl).snapshotChanges().subscribe(entry => {
      entry.map(tuple => {
        if (tuple.key === this.company_name){
          this.loading = true;
          this.db.list('/Field_names/'+field+'/'+lvl)
                  .remove(this.company_name)
                  .then(function () {
                    this.arr = this.arr.filter(function(job) {
                      if (job.ctc != ctc && job.field != field)
                        return job;
                    })
                    del_ref.unsubscribe();
                    this.loading = false;
                    this.openSnackBar('Job Post Removed');
                  })
        }
      })
    })
  }

  openSnackBar(message: string) {
    this.snackBar.open( message,null,  {
      duration: 1000
    });
  }

  logout() {
    this.router.navigateByUrl("/");
  }

}


export class JOBS {
  ctc : number;
  field : string;
}
