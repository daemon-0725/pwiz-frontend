import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { stringLength } from '@firebase/util';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  fields = ['Front End','Back End','Full Stack','Cloud', 'Data Science', 'Database', 'Machine Learning', 'Security','Marketing','Mobile']
  selected_field : string;
  company_name : string;
  //@Input() compaa : string;
  ctc : number;
  counter = 0;
  arr : JOBS[] = [];

  constructor(private db: AngularFireDatabase, 
              private snackBar: MatSnackBar,
              private route : ActivatedRoute,
              private router : Router) {
    for (let i=0;i<this.fields.length;i++) 
      for (let lvl of ['H', 'M', 'L']) {
        this.db.list("/Field_names/"+this.fields[i]+"/"+lvl).snapshotChanges().subscribe(item => {
          item.map(val => {
            if(val.key === this.company_name)
                this.arr.push({ctc:Number(val.payload.val()), field: this.fields[i]})
                //console.log(this.arr);
          })
        });
      }
  }

  ngOnInit() {
    this.company_name = this.route.snapshot.paramMap.get('comp');
    //console.log(this.compaa);
  }

  submit( ctc: number, field : string) {
    console.log(this.company_name + " " + ctc)
    ctc = Number(ctc);
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
    this.db.list("/Field_names/"+field+'/'+lvl).set(this.company_name, ctc);
  }

  removePost(field : string, ctc : number) {
    var lvl : string;
    if(ctc > 5.5) {lvl = 'H';}
    else if (ctc > 3.5) {lvl = 'M';}
    else {lvl = 'L';}
    this.db.list('/Field_names/'+field+'/'+lvl).snapshotChanges().subscribe(entry => {
      entry.map(tuple => {
        if (tuple.key === this.company_name){
          this.db.list('/Field_names/'+field+'/'+lvl)
                  .remove(this.company_name)
                  .then(function () {
                    this.arr = this.arr.filter(function(job) {
                      if (job.ctc != ctc && job.field != field)
                        return job;
                    })
                    this.openSnackBar('Job Post Removed');
                  })
          
          /*setTimeout(function() {
            location.reload(true);
          },1500)*/
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
