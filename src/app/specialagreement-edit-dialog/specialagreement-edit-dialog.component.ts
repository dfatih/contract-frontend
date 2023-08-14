import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Signee} from '../model/domain/signee';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OptionalContent} from '../model/domain/optionalContent';

@Component({
  selector: 'app-specialagreement-edit-dialog',
  templateUrl: './specialagreement-edit-dialog.component.html',
  styleUrls: ['./specialagreement-edit-dialog.component.css']
})
export class SpecialagreementEditDialogComponent implements OnInit {

  formGroup: FormGroup;
  isFormGroupReady = false;
  specialAgreement: OptionalContent;

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SpecialagreementEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.specialAgreement = data.specialAgreementInDIalog;
  }

  ngOnInit(): void {
    console.log(this.specialAgreement);
    this.formGroup = this._formBuilder.group({
      title: [this.specialAgreement.title !== undefined ? this.specialAgreement.title : '', Validators.required],
      content: [this.specialAgreement.content !== undefined ? this.specialAgreement.content.replace('|(n) ', '').replace('<br/><br/>', '') : '', Validators.required]
    });
    this.isFormGroupReady = true;
  }

  submitSpecialAgreement(): void {
    this.specialAgreement.title = this.formGroup.controls['title'].value;
    this.specialAgreement.content = '|(n) ' + this.formGroup.controls['content'].value + '<br/><br/>';
    this.dialogRef.close(this.specialAgreement);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
