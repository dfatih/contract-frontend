import { Component, OnInit } from '@angular/core';
import { Input, ViewChild  } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-hochladen',
  templateUrl: './hochladen.component.html',
  styleUrls: ['./hochladen.component.css']
})
export class HochladenComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  @ViewChild('fileInput') fileInput;
  @Input() name: string;

  // tslint:disable-next-line:variable-name
  constructor(private _formBuilder: FormBuilder) {}
  // Upload File for the Backend
/**
 uploadFile() {
    let params = new HttpParams();

    let formData = new FormData();
    formData.append('upload', this.fileInput.nativeElement.files[0])

    const options = {
      headers: new HttpHeaders().set('Authorization', this.loopBackAuth.accessTokenId),
      params: params,
      reportProgress: true,
      withCredentials: true,
    }

    this.http.post('http://localhost:4200/api/FileUploads/fileupload', formData, options)
      .subscribe(
        data => {
          console.log("Subscribe data", data);
        },
        (err: HttpErrorResponse) => {
          console.log(err.message, JSON.parse(err.error).error.message);
        }
      )
      .add(() => this.uploadBtn.nativeElement.disabled = false);//teardown
  }
 */
// For Stepper Effect
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  upload() {

  }
}

