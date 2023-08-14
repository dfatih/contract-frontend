import {Component, OnInit} from '@angular/core';

import {SessionService} from '../services/session.service';
import {Session} from '../model/domain/session';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ContractVersion} from '../model/domain/contractVersion';
import {ApiService} from '../services/api.service';
import {ConfigAssetLoaderService} from '../services/configuration.service';

@Component({
// tslint:disable-next-line:component-selector
  selector: 'vertragsversion',
  templateUrl: './vertragsversion.component.html',
  styleUrls: ['./vertragsversion.component.css']
})
export class VertragsversionComponent implements OnInit {

  contractVersions: ContractVersion[] = [];
  vertragsVersionSelected: ContractVersion;
  showcontent = false;
  form: FormGroup = new FormGroup({});

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private _formBuilder: FormBuilder,
    private configLoader: ConfigAssetLoaderService) {
  }

  normalize(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  ngOnInit(): void {
    this.apiService.getRequest(this.configLoader.configuration.backend + 'api/contractVersions').subscribe((response: any) => {
      this.contractVersions = response;
      console.log(this.contractVersions[0].templateNames);
      console.log(this.contractVersions[0].templateNames[0]);
      const session: Session = this.sessionService.getSession();
      session.contractVersions = this.contractVersions;
      this.sessionService.setSession(session);
      this.contractVersions.forEach((contractVersion: ContractVersion) => {
        this.addFormControl(contractVersion.name);
        contractVersion.templateNames.forEach((versionTemplateName: string) => {
          this.addFormControlForTemplate(versionTemplateName);
        });
      });
    });
  }

  addFormControl(controlName: string): void {
    console.log('controlName: ' + controlName);
    if (this.sessionService.getSession().currentContract.contractVersionName === controlName.toUpperCase()) {
      console.log('this.sessionService.getSession().currentContract.contractVersionName: ' + this.sessionService.getSession().currentContract.contractVersionName);
      this.form.addControl(controlName, new FormControl(true, Validators.required));
      for (const contractVersion of this.contractVersions) {
        if (contractVersion.name === controlName) {
          this.vertragsVersionSelected = contractVersion;
          this.showcontent = true;
        }
      }
    } else {
      console.log('false: ' + this.sessionService.getSession().currentContract.contractVersionName);
      this.form.addControl(controlName, new FormControl(false, Validators.required));
    }
  }

  addFormControlForTemplate(controlName: string): void {
    if (this.sessionService.getSession().currentContract.versionTemplateName === controlName.toUpperCase().split(' ').join('_')) {
      this.form.addControl(controlName, new FormControl(true, Validators.required));
    } else {
      this.form.addControl(controlName, new FormControl(false, Validators.required));
    }
  }

  setVersion(contractVersionName: string): void {
    this.showcontent = false;
    let session: Session = this.sessionService.getSession();
    session.selectedContractVersionName = contractVersionName.toUpperCase();
    console.log('session.selectedContractVersionName: ' + session.selectedContractVersionName);
    this.sessionService.setSession(session);
    for (const contractVersion of this.contractVersions) {
      if (contractVersion.name === contractVersionName) {
        this.vertragsVersionSelected = contractVersion;
        for (const templateName of contractVersion.templateNames) {
          this.form.get(templateName).setValue(false);
        }
        setTimeout(() => {
          this.showcontent = true;
        }, 1);
      }
    }
  }

  setTemplate(versionTemplate: string): void {
    let session: Session = this.sessionService.getSession();
    session.selectedVersionTemplateName = versionTemplate.toUpperCase().split(' ').join('_');
    console.log('session.selectedVersionTemplateName: ' + session.selectedVersionTemplateName);
    this.sessionService.setSession(session);
  }
}
