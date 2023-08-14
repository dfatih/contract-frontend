import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Signee} from '../model/domain/signee';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-signee-dialog',
  templateUrl: './signee-dialog.component.html',
  styleUrls: ['./signee-dialog.component.css']
})
export class SigneeDialogComponent implements OnInit {

  signeeDialogFormGroup: FormGroup;
  isSigneeDialogFormGrouReady = false;
  signee: Signee;

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SigneeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.signee = data.signeeInDIalog;
  }

  ngOnInit(): void {
    console.log(this.signee);
    this.signeeDialogFormGroup = this._formBuilder.group({
    name: [this.signee.name !== undefined ? this.signee.name : '', Validators.required],
    position: [this.signee.position !== undefined ? this.signee.position : '', Validators.required]
  });
    this.isSigneeDialogFormGrouReady = true;
  }

  submitSignee(): void {
    this.signee.name = this.signeeDialogFormGroup.controls['name'].value;
    this.signee.position = this.signeeDialogFormGroup.controls['position'].value;
    this.dialogRef.close(this.signee);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
