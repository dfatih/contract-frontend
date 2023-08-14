import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-specialagreements-dialog',
  templateUrl: './specialagreements-dialog.component.html',
  styleUrls: ['./specialagreements-dialog.component.css']
})
export class SpecialagreementsDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

}
