import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Contract} from '../model/domain/contract.model';
import {Company} from '../model/domain/company';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../services/session.service';
import {Paragraph} from '../model/domain/paragraph.model';
import {InputParagraph} from '../model/domain/inputParagraph';
import {Candidate} from '../model/domain/candidate';
import {ApiService} from '../services/api.service';
import {PasswordDialogComponent} from '../password-dialog/password-dialog.component';
import {UpdateContractService} from '../services/update-contract.service';
import {Session} from '../model/domain/session';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {OptionalContent} from '../model/domain/optionalContent';
import {ContentField} from '../model/domain/contentField';
import {OptionalContentField} from '../model/domain/optionalContentField';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {ConfigAssetLoaderService} from '../services/configuration.service';

import {EditorChangeContent, EditorChangeSelection} from 'ngx-quill';
import Quill from 'quill';
import {SpecialagreementsDialogComponent} from '../specialagreements-dialog/specialagreements-dialog.component';
import {CompanyLocation} from '../model/domain/companyLocation';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {SigneeDialogComponent} from '../signee-dialog/signee-dialog.component';
import {Signee} from '../model/domain/signee';
import {SnackbarService} from '../services/snackbar.service';
import {SpecialagreementEditDialogComponent} from '../specialagreement-edit-dialog/specialagreement-edit-dialog.component';
import {formatDate} from '@angular/common';
import {LoadingService} from '../services/loading.service';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {FillerComponent} from '../filler/filler.component';

interface salutaions {
  value: string;
  viewValue: string;
}

interface degrees {
  value: string;
  viewValue: string;
}

export const DE_FORMAT = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


// @ts-ignore
@Component({
  selector: 'app-erstellen',
  templateUrl: './erstellen.component.html',
  styleUrls: ['./erstellen.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DE_FORMAT},
  ]

})
export class ErstellenComponent {

  get formArray(): AbstractControl | null {
    return this.fourthFormGroup.get('formArray');
  }

  htmlContent = '';
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],        // toggled buttons

      [{'list': 'ordered'}, {'list': 'bullet'}],

      [{'align': []}],
    ],
  };

  blurred = false;
  focused = false;
  decrypted = false;
  loading = false;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup = new FormGroup({});
  wysiwygFormGroup: FormGroup = new FormGroup({quillContent: new FormControl('')});
  signeeFormGroup: FormGroup = new FormGroup({nameOfSignee: new FormControl('')});

  companies: Company[] = [];
  locations: CompanyLocation[] = [];
  salutations: salutaions[] = [
    {value: 'Herrn', viewValue: 'Herr'},
    {value: 'Frau', viewValue: 'Frau'},
    {value: 'divers', viewValue: 'divers'},
  ];
  degrees: degrees[] = [
    {value: 'Dr.', viewValue: 'Dr.'},
    {value: 'Prof.', viewValue: 'Prof.'},
    {value: '-', viewValue: ''},
  ];
  /* templates: templates[] = [
     {value: '|<c>*Gültig für Mitarbeiter Verwaltung*\n' +
         '|<t>*Arbeitsvertrag*\n\n' +
         '|Zwischen der |<50>*[workplace]*\n' +
         '|<106>*[location]*\n\n' +
         '|<106>als Arbeitgeber\n\n' +
         '|<0>und |<89>*[salutation] [firstName] [lastName]*\n' +
         '|<106>Anschrift: *[street] [streetNumber], [zipCode] [residence]*\n\n' +
         '|<106>als Arbeitnehmer\n\n' +
         '|<0>wird folgender Arbeitsvertrag geschlossen:\n\n\n', viewValue: 'Verkauf'},
     {value: '|<c>*Gültig für Mitarbeiter Verwaltung*\n' +
         '|<t>*Arbeitsvertrag*\n\n' +
         '|Zwischen der |<50>*[workplace]*\n' +
         '|<106>*[location]*\n\n' +
         '|<106>als Arbeitgeber\n\n' +
         '|<0>und |<89>*[salutation] [firstName] [lastName]*\n' +
         '|<106>Anschrift: *[street] [streetNumber], [zipCode] [residence]*\n\n' +
         '|<106>als Arbeitnehmer\n\n' +
         '|<0>wird folgender Arbeitsvertrag geschlossen:\n\n\n', viewValue: 'Monteur'},
     {value: '|<c>*Gültig für Mitarbeiter Verwaltung*\n' +
         '|<t>*Arbeitsvertrag*\n\n' +
         '|Zwischen der |<50>*[workplace]*\n' +
         '|<106>*[location]*\n\n' +
         '|<106>als Arbeitgeber\n\n' +
         '|<0>und |<89>*[salutation] [firstName] [lastName]*\n' +
         '|<106>Anschrift: *[street] [streetNumber], [zipCode] [residence]*\n\n' +
         '|<106>als Arbeitnehmer\n\n' +
         '|<0>wird folgender Arbeitsvertrag geschlossen:\n\n\n', viewValue: 'Service'},
     {value: '|<c>*Gültig für Mitarbeiter Verwaltung*\n' +
         '|<t>*Arbeitsvertrag*\n\n' +
         '|Zwischen der |<50>*[workplace]*\n' +
         '|<106>*[location]*\n\n' +
         '|<106>als Arbeitgeber\n\n' +
         '|<0>und |<89>*[salutation] [firstName] [lastName]*\n' +
         '|<106>Anschrift: *[street] [streetNumber], [zipCode] [residence]*\n\n' +
         '|<106>als Arbeitnehmer\n\n' +
         '|<0>wird folgender Arbeitsvertrag geschlossen:\n\n\n', viewValue: 'Logistik'}
   ]; */

  paragraphs: Paragraph[] = [];
  cleanParagraphs: Paragraph[] = [];
  specialAgreements: OptionalContent[] = [];
  finalParagraphs: Paragraph[] = [];
  signees: Signee[] = [];
  specialAgreementParagraph: Paragraph;
  isCompanySelected = false;
  areFormControlsReady = false;
  isFirstFormGroupReady = false;
  isSecondFormGroupReady = false;
  isThirdFormGroupReady = false;

  id: number;
  shortName: string;
  contract: Contract = new Contract();
  isNew = false;
  templateChanged = false;
  company: Company = new Company();
  candidate: Candidate = new Candidate();
  brRegex = '<br/>';
  dateRegex = /.*atum.*/;
  optionRegex = /.* \/ .*/;
  hasLoyaltyBonus = false;
  hasBonus = false;
  alternativeAddressInput = false;
  overlayRef: OverlayRef;

  public tabIndex = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private sessionService: SessionService,
    private apiService: ApiService,
    private updateService: UpdateContractService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private configLoader: ConfigAssetLoaderService,
    private snackbar: SnackbarService,
    private loadingService: LoadingService,
    private overlay: Overlay) {
    this.id = this.route.snapshot.params['id'];
    this.shortName = this.route.snapshot.params['shortName'];
    this.loadingService.loading$.subscribe((loadingState: boolean) => {
      if (loadingState !== undefined) {
        this.loading = loadingState;
      }
    });
  }

  ngOnInit(): void {
    this.apiService.getRequest(this.configLoader.configuration.backend + 'companies').subscribe((response: any) => {
      console.log('companyresponse');
      console.log(response);
      this.companies = response._embedded.companies;
      for (const company of this.companies) {
        this.apiService.getRequest(company._links.companyLocations.href).subscribe((locationResponse: any) => {
          company.companyLocations = locationResponse._embedded.companyLocations;
        });
      }
      if (this.companies.length === 0) {
        this.snackbar.openSnackbarFromComponent('Es sind keine Firmen hinterlegt.', 3000);
      }
      console.log('this.companies');
      console.log(this.companies);
      if (this.id === undefined) {
        this.isNew = true;
        this.createFormControls();
        this.fakeInit();
        this.decrypted = true;
      } else {
        const dialogRef = this.dialog.open(PasswordDialogComponent, {data: {password: ''}});

        dialogRef.afterClosed().subscribe(result => {
          if (result === false) {
            this.router.navigate(['liste']);
          } else {
            this.apiService.getRequest<Contract>(this.configLoader.configuration.backend + 'api/contracts/' + this.id + '?projection=ContractWithParagraphs&company=' + this.shortName, result).subscribe((response: any) => {

              this.contract = response;
              this.signees = this.contract.signeeList;
              console.log('this.contract:');
              console.log(this.contract);
              this.contract.id = this.id;
              // this.apiService.getRequest(this.contract._links.paragraphList.href).subscribe((paragraphResponse: any) => {
              //   let paragraphResponseList: Paragraph[] = paragraphResponse._embedded.contractParagraphs;
              let paragraphResponseList: Paragraph[] = this.contract.paragraphList;
              console.log('paragraphResponseList');
              console.log(paragraphResponseList);
              for (let paragraph of paragraphResponseList) {
                // this.apiService.getRequest(paragraph._links.contentFields.href).subscribe((contentFieldResponse: any) => {
                //   paragraph.contentFields = contentFieldResponse._embedded.contentFields;
                // });
                // this.apiService.getRequest(paragraph._links.optionalContents.href).subscribe((optionalContentResponse: any) => {
                for (let contentField of paragraph.contentFields) {
                  if (contentField.fieldName.match(this.optionRegex)) {
                    contentField.fieldOptions = contentField.fieldName.split('/');
                  }
                }
                console.log('paragraph.optionalContents');
                console.log(paragraph.optionalContents);
                let optionalContentResponseList: OptionalContent[] = [];
                // for (const optionalContent of optionalContentResponse._embedded.optionalContents) {
                for (const optionalContent of paragraph.optionalContents) {
                  if (optionalContent.modified) {
                    this.specialAgreements.push(optionalContent);
                  } else {
                    optionalContentResponseList.push(optionalContent);
                  }
                }
                /*for (let optionalContent of optionalContentResponseList) {
                  this.apiService.getRequest(optionalContent._links.optionalContentFields.href).subscribe((optionalContentFieldResponse: any) => {
                    optionalContent.optionalContentFields = optionalContentFieldResponse._embedded.optionalContentFields;
                  });
                }*/
                paragraph.optionalContents = optionalContentResponseList;
                // });
              }
              this.contract.paragraphList = paragraphResponseList;
              this.cleanParagraphs = this.contract.paragraphList;
              // console.log(paragraphResponse);
              setTimeout(() => {
                this.fakeInit();
                this.createFormControls();
              }, 300);
              console.log('paragraphResponseList:');
              console.log(paragraphResponseList);
              console.log('this.cleanParagraphs inside NgOnInit:');
              console.log(this.cleanParagraphs);
              this.decrypted = true;
              // });
              const session: Session = this.sessionService.getSession();
              session.currentContract = this.contract;
              session.selectedContractVersionName = session.currentContract.contractVersionName;
              session.selectedVersionTemplateName = session.currentContract.versionTemplateName;
              this.sessionService.setSession(session);
            }, error => console.log(error));
          }
        });
      }
    });
  }

  fakeInit(): void {
    // this.createFormControls();
    // tslint:disable-next-line:max-line-length
    this.contract = this.sessionService.getSession().currentContract !== undefined ? this.contract = this.sessionService.getSession().currentContract : new Contract();
    if (this.contract === new Contract()) {
      this.isNew = true;
    }
    if (this.contract.candidateId !== undefined) {
      console.log(this.contract.candidateId);
      this.apiService.getRequest(this.configLoader.configuration.backend + 'api/candidates/' + this.contract.candidateId).subscribe((response: any) => {
        console.log('BLA');
        this.candidate = response;
        if (this.candidate.streetNumber === '') {
          this.alternativeAddressInput = true;
          this.secondFormGroup = this._formBuilder.group({
            salutation: [this.candidate.salutation !== undefined ? this.candidate.salutation : '', Validators.required],
            degree: [this.candidate.degree !== undefined ? this.candidate.degree : ''],
            firstname: [this.candidate.firstName !== undefined ? this.candidate.firstName : '', Validators.required],
            surname: [this.candidate.lastName !== undefined ? this.candidate.lastName : '', Validators.required],
            firstRow: [this.candidate.residence !== undefined ? this.candidate.residence : '', Validators.required]
          });
        } else {
          this.secondFormGroup = this._formBuilder.group({
            salutation: [this.candidate.salutation !== undefined ? this.candidate.salutation : '', Validators.required],
            degree: [this.candidate.degree !== undefined ? this.candidate.degree : ''],
            firstname: [this.candidate.firstName !== undefined ? this.candidate.firstName : '', Validators.required],
            surname: [this.candidate.lastName !== undefined ? this.candidate.lastName : '', Validators.required],
            street: [this.candidate.street !== undefined ? this.candidate.street : '', Validators.required],
            streetnumber: [this.candidate.streetNumber !== undefined ? this.candidate.streetNumber : '', Validators.required],
            zipcode: [this.candidate.zipCode !== undefined ? this.candidate.zipCode : '', Validators.required],
            residence: [this.candidate.residence !== undefined ? this.candidate.residence : '', Validators.required]
          });
        }
        this.isSecondFormGroupReady = true;
      });
    } else {
      this.secondFormGroup = this._formBuilder.group({
        salutation: ['', Validators.required],
        degree: [''],
        firstname: ['', Validators.required],
        surname: ['', Validators.required],
        street: ['', Validators.required],
        streetnumber: ['', Validators.required],
        zipcode: ['', Validators.required],
        residence: ['', Validators.required]
      });
      this.isSecondFormGroupReady = true;
    }
    // this.contract.template = '|<t>*Arbeitsvertrag*\n\n' +
    //   '|Zwischen der |<44>*[companyName]*\n' +
    //   '|<106>*[companyLocation]*\n\n' +
    //   '|<106>als Arbeitgeber\n\n' +
    //   '|<0>und |<86>*[salutation] [degree] [firstName] [lastName]*\n' +
    //   '|<106>Anschrift: *[street] [streetNumber], [zipCode] [residence]*\n\n' +
    //   '|<106>als Arbeitnehmer ' +
    //   '|<s>_- die männliche Bezeichnung „Arbeitnehmer“\n wird ' +
    //   'aus Gründen der sprachlichen\n Vereinfachung ' +
    //   'gewählt; die Bestimmungen \ndieses Vertrages ' +
    //   'gelten ungeachtet dieser \nBezeichnung für ' +
    //   'Beschäftigte jeden Geschlechts - _\n\n ' +
    //   '|<0>wird folgender Arbeitsvertrag geschlossen:\n\n\n';
    console.log(this.contract);
    console.log('this.companies');
    console.log(this.companies);
    if (this.contract.companyId !== undefined) {
      for (const company of this.companies) {
        if (company.companyId === this.contract.companyId) {
          this.contract.company = company;
          this.setLocations(company);
        }
      }
    }
    this.firstFormGroup = this._formBuilder.group({
      companyCtrl: [this.contract.company !== undefined ? this.contract.company : '', Validators.required],
      locationCtrl: [this.contract.location !== undefined ? this.getCompanyLocationOfAddress(this.contract.location) : '', Validators.required]
      // templateCtrl: [this.contract.template !== undefined ? this.contract.template : '', Validators.required]
    });
    this.isFirstFormGroupReady = true;
    console.log(this.contract);

    this.thirdFormGroup = this._formBuilder.group({
      placeOfSignature: [this.contract.placeOfSignature !== undefined ? this.contract.placeOfSignature : '', Validators.required],
      dateOfSignature: [this.contract.dateOfSignature !== undefined ? this.contract.dateOfSignature : '', Validators.required],
    });
    const session: Session = this.sessionService.getSession();
    session.currentContract = this.contract;
    this.sessionService.setSession(session);
    this.isThirdFormGroupReady = true;
  }

  /*created(event: Quill) {
    // tslint:disable-next-line:no-console
    console.log('editor-created', event);
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    console.log('editor-change', event);
  }

  focus($event) {
    // tslint:disable-next-line:no-console
    console.log('focus', $event);
    this.focused = true;
    this.blurred = false;
  }

  blur($event) {
    // tslint:disable-next-line:no-console
    console.log('blur', $event);
    this.focused = false;
    this.blurred = true;
  }


  savePost(): void {
    let paragraphList: Paragraph[] = [];
    let paragraph: Paragraph = new Paragraph();
    paragraph.paragraphTitle = this.wysiwygFormGroup.get('title').value;
    paragraph.paragraphContent = this.wysiwygFormGroup.get('htmlContent').value;
    paragraph.paragraphNumber = '26';
    paragraph.isClean = false;
    paragraph.template = false;
    paragraphList.push(paragraph);
    this.apiService.postRequest('http://localhost:8080/api/saveParagraphList', paragraphList).subscribe((response: any) => {
      console.log(response);
    });
  }*/

  showOverlay(): void {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
    this.overlayRef.attach(new ComponentPortal(FillerComponent));
  }

  hideOverlay(): void {
    this.overlayRef.detach();
    this.overlayRef.dispose();
  }

  onSubmit(): void {
    console.log('firstFormGroup: ' + JSON.stringify(this.firstFormGroup.value));
    console.log('secondFormGroup: ' + JSON.stringify(this.secondFormGroup.value));
    console.log('thirdFormGroup: ' + JSON.stringify(this.thirdFormGroup.value));
    console.log('fourthFormGroup: ' + JSON.stringify(this.fourthFormGroup.value));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SpecialagreementsDialogComponent, {data: {title: ''}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result !== '') {
        this.addSpecialAgreement(result);
      }
    });
  }

  editSpecialAgreement(specialAgreement: OptionalContent): void {
    const dialogRef = this.dialog.open(SpecialagreementEditDialogComponent, {data: {
        specialAgreementInDIalog: specialAgreement
      } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`SpecialAgreementEditDialog result: ${result}`);
      if (result !== false) {
        const index = this.specialAgreements.indexOf(specialAgreement);
        if (specialAgreement.shortName !== result.shortName) {
          this.cleanParagraphs.at(this.getIndexOfSpecialAgreement(this.cleanParagraphs)).paragraphContent.replace('[' + specialAgreement.shortName + ']', '[' + result.shortName + ']');
        }
        this.specialAgreements[index] = result;
      }
    });
  }

  openSigneeDialog(): void {
    const dialogRef = this.dialog.open(SigneeDialogComponent, {data: {
      signeeInDIalog: new Signee()
      }});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`SigneeDialog result: ${result}`);
      if (result !== false) {
        this.addSignee(result);
      }
    });
  }

  setLocations(company: Company): void {
    this.locations = company.companyLocations;
    this.isCompanySelected = true;
  }

  getCompanyLocationOfAddress(address: string): CompanyLocation {
    for (const location of this.locations) {
      if (location.address === address) {
        return location;
      }
    }
    return null;
  }

  addSpecialAgreement(title: string): void {
    let specialAgreement: OptionalContent = new OptionalContent();
    console.log('wysiwygFormGroup');
    console.log(this.wysiwygFormGroup);
    specialAgreement.title = title;
    specialAgreement.shortName = title;
    specialAgreement.content = '|(n) ' + this.wysiwygFormGroup.get('quillContent').value.replace(this.brRegex, '') + '<br/>';
    specialAgreement.modified = true;
    specialAgreement.selected = true;
    this.cleanParagraphs.at(this.getIndexOfSpecialAgreement(this.cleanParagraphs)).paragraphContent += '[' + specialAgreement.shortName + ']';
    this.specialAgreements.push(specialAgreement);
  }

  addSignee(signee: Signee): void {
    this.signees.push(signee);
  }

  editSignee(signee: Signee): void {
    const dialogRef = this.dialog.open(SigneeDialogComponent, {data: {
        signeeInDIalog: signee
      } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`SigneeDialog result: ${result}`);
      if (result !== false) {
        this.signees[this.signees.indexOf(signee)] = result;
      }
    });
  }

  deleteSignee(signee: Signee): void {
    const index = this.signees.indexOf(signee);
    this.signees.splice(index, 1);
  }

  deleteSpecialAgreement(specialAgreement: OptionalContent): void {
    this.cleanParagraphs.at(this.getIndexOfSpecialAgreement(this.cleanParagraphs)).paragraphContent = this.cleanParagraphs.at(this.getIndexOfSpecialAgreement(this.cleanParagraphs)).paragraphContent.replace('[' + specialAgreement.shortName + ']', '');
    const index = this.specialAgreements.indexOf(specialAgreement);
    this.specialAgreements.splice(index, 1);
  }

  getIndexOfSpecialAgreement(paragraphList: Paragraph[]): number {
    for (const paragraph of paragraphList) {
      if (paragraph.paragraphTitle === 'Sondervereinbarung') {
        return paragraphList.indexOf(paragraph);
      }
    }
  }

  public nextTabAndLoadParagraphs(): void {
    let session: Session = this.sessionService.getSession();
    if (this.isNew || (session.currentContract.contractVersionName !== session.selectedContractVersionName) || (session.currentContract.versionTemplateName !== session.selectedVersionTemplateName)) {
      console.log('inside nextTab');
      this.templateChanged = true;
      this.apiService.getRequest<any>(this.configLoader.configuration.backend + 'api/getCleanParagraphsByVersionAndTemplate?contractVersionName=' + session.selectedContractVersionName + '&versionTemplateName=' + session.selectedVersionTemplateName).subscribe((response: any) => {
        console.log('response:');
        console.log(response);
        this.cleanParagraphs = response;
        session.currentContract.contractVersionName = session.selectedContractVersionName;
        session.currentContract.versionTemplateName = session.selectedVersionTemplateName;
        this.contract = session.currentContract;
        this.sessionService.setSession(session);
        this.specialAgreements = [];
        // setTimeout(() => {
        this.createFormControls();
        this.nextTab();
        // }, 320);
      });
    } else {
      session.currentContract.contractVersionName = session.selectedContractVersionName;
      session.currentContract.versionTemplateName = session.selectedVersionTemplateName;
      this.contract = session.currentContract;
      this.sessionService.setSession(session);
      this.createFormControls();
      this.nextTab();
    }
  }

  public nextTab(): void {
    const tabCount = 4;
    this.tabIndex = (this.tabIndex + 1) % tabCount;
  }

  public previousTab(): void {
    const tabCount = 4;
    this.tabIndex = (this.tabIndex - 1) % tabCount;
  }

  saveContract(): void {
    const dialogRef = this.dialog.open(PasswordDialogComponent, {data: {password: ''}});

    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.showOverlay();
        this.loadingService.setLoading(true);
        this.save(result);
      }
    });
  }

  // getCompanyById(id: number): string {
  //   let company2: Company = new Company();
  //   this.companies.forEach((company: Company) => {
  //     if (company.companyId === id) {
  //       company2 = company;
  //     }
  //   });
  //   return company2.shortName;
  // }

  // getCompanyIdByValue(value: string): number {
  //   console.log('value: ' + value);
  //   let companyId = null;
  //   this.companies.forEach((company: Company) => {
  //     console.log('company.value: ' + company.shortName);
  //     if (company.shortName === value) {
  //       console.log('ab ins if: ' + company.companyId);
  //       companyId = company.companyId;
  //     }
  //   });
  //   return companyId;
  // }

  private save(encryptionPassword: string): void {
    this.finalParagraphs = [];
    console.log(this.cleanParagraphs);
    this.contract = this.sessionService.getSession().currentContract;
    this.contract.companyId = this.firstFormGroup.get('companyCtrl').value.companyId;
    console.log('company:');
    console.log(this.firstFormGroup.get('companyCtrl').value);
    this.contract.location = this.firstFormGroup.get('locationCtrl').value.address;
    this.candidate.salutation = this.secondFormGroup.get('salutation').value;
    this.candidate.degree = this.secondFormGroup.get('degree').value;
    this.candidate.firstName = this.secondFormGroup.get('firstname').value;
    this.candidate.lastName = this.secondFormGroup.get('surname').value;
    if (this.alternativeAddressInput) {
      this.candidate.streetNumber = '';
      this.candidate.zipCode = '';
      this.candidate.residence = this.secondFormGroup.get('firstRow').value;
    } else {
      this.candidate.street = this.secondFormGroup.get('street').value;
      this.candidate.streetNumber = this.secondFormGroup.get('streetnumber').value;
      this.candidate.zipCode = this.secondFormGroup.get('zipcode').value;
      this.candidate.residence = this.secondFormGroup.get('residence').value;
    }
    this.contract.placeOfSignature = this.thirdFormGroup.get('placeOfSignature').value;
    this.contract.dateOfSignature = this.thirdFormGroup.get('dateOfSignature').value;
    this.contract.signeeList = this.signees;
    const dateStringArray: string[] = new Date(this.contract.dateOfSignature).toLocaleDateString('de-DE').split('.');
    this.contract.dateOfSignature = new Date(Number(dateStringArray[2]), Number(dateStringArray[1]) - 1, Number(dateStringArray[0]), 12);
    console.log(this.contract.dateOfSignature);
    this.contract.fileName = this.candidate.firstName + '_' + this.candidate.lastName + '.pdf';

    this.cleanParagraphs.forEach((input: Paragraph) => {
      let finalParagraph: Paragraph = new Paragraph();
      finalParagraph.paragraphNumber = input.paragraphNumber;
      finalParagraph.paragraphTitle = input.paragraphTitle;
      finalParagraph.paragraphContent = input.paragraphContent;
      finalParagraph.template = false;
      finalParagraph.clean = input.clean;
      finalParagraph.contentFields = input.contentFields;
      finalParagraph.optionalContents = input.optionalContents;
      finalParagraph.selectionGroups = input.selectionGroups;
      if (finalParagraph.contentFields === undefined) {
        console.log('1. Paragraph does not have any fields.');
      } else {
        finalParagraph.contentFields.forEach((inputField: ContentField) => {
          if (inputField.fieldType.match('DATUM')) {
            let dateStringArray3: string[] = new Date(this.fourthFormGroup.get(input.paragraphNumber)['controls'][inputField.formControlName].value).toLocaleDateString('de-DE').split('.');
            let date3 = new Date(Number(dateStringArray3[2]), Number(dateStringArray3[1]) - 1, Number(dateStringArray3[0]), 12);
            inputField.fieldValue = this.formatDate(date3);
          } else {
            inputField.fieldValue = this.fourthFormGroup.get(input.paragraphNumber)['controls'][inputField.formControlName].value;
          }
        });
      }
      if (finalParagraph.optionalContents === undefined) {
        console.log('no optionalContent');
      } else {
        finalParagraph.optionalContents.forEach((optionalContent: OptionalContent) => {
          if (optionalContent.selected && optionalContent.optionalContentFields !== undefined ) {
            optionalContent.optionalContentFields.forEach((optionalContentField: OptionalContentField) => {
              if (optionalContentField.fieldName.match(this.dateRegex)) {
                let dateStringArray2: string[] = new Date(this.fourthFormGroup.get(input.paragraphNumber)['controls'][optionalContentField.formControlName].value).toLocaleDateString('de-DE').split('.');
                let date2 = new Date(Number(dateStringArray2[2]), Number(dateStringArray2[1]) - 1, Number(dateStringArray2[0]), 12);
                optionalContentField.fieldValue = this.formatDate(date2);
              } else {
                optionalContentField.fieldValue = this.fourthFormGroup.get(input.paragraphNumber)['controls'][optionalContentField.formControlName].value;
                if (optionalContentField.fieldName === 'Treueprämie' && !this.hasLoyaltyBonus) {
                  optionalContentField.fieldValue = '';
                }
              }

            });
          }
        });
      }
      if (!this.isNew && !input.clean) {
        finalParagraph.id = input.id;
      }
      if (input.paragraphTitle === 'Sondervereinbarung') {
        for (const specialAgreement of this.specialAgreements) {
          finalParagraph.optionalContents.push(specialAgreement);
        }
      }
      this.finalParagraphs.push(finalParagraph);
    });
    console.log('final after save');
    console.log(this.finalParagraphs);
    console.log(this.cleanParagraphs);

    if (this.isNew) {
      this.apiService.postRequest(this.configLoader.configuration.backend + 'api/saveCandidate?company=' + this.firstFormGroup.get('companyCtrl').value.shortName, this.candidate, encryptionPassword).subscribe((response: any) => {
        if (response.candidateId !== undefined && response.candidateId !== null) {
          console.log(response);
          this.contract.candidateId = response.candidateId;
          this.contract.paragraphList = this.finalParagraphs;
          this.contract.companyId = this.firstFormGroup.get('companyCtrl').value.companyId;
          // tslint:disable-next-line:max-line-length
          this.apiService.postRequest(this.configLoader.configuration.backend + 'api/saveContract', this.contract, encryptionPassword).subscribe((contractResponse: any) => {
            console.log(contractResponse);
            this.contract.paragraphList.forEach((paragraph: Paragraph) => {
                paragraph.contract = contractResponse;
              },
              (error) => {
                this.snackbar.openSnackbarFromComponent(error, 5000);
              });
            console.log(this.contract.paragraphList);
            // tslint:disable-next-line:max-line-length
            this.apiService.postRequest(this.configLoader.configuration.backend + 'api/saveParagraphList?company=' + this.firstFormGroup.get('companyCtrl').value.shortName, this.contract.paragraphList, encryptionPassword).subscribe((paragraphResponse: any) => {
              this.contract.paragraphList = paragraphResponse;
              console.log(this.contract);
              this.hideOverlay();
              this.loadingService.setLoading(false);
              this.router.navigate(['liste']);
            });
          });
        } else {
          this.snackbar.openSnackbarFromComponent('Candidate konnte nicht gespeichert werden.', 5000);
        }
      });
    } else {
      // tslint:disable-next-line:max-line-length
      this.apiService.putRequest(this.configLoader.configuration.backend + 'candidates/' + this.candidate.candidateId + '?company=' + this.firstFormGroup.get('companyCtrl').value.shortName, this.candidate, encryptionPassword).subscribe((response: any) => {
        if (response.candidateId !== undefined && response.candidateId !== null) {
          console.log(response);
          // this.contract.candidateId = response.candidateId;
          this.contract.paragraphList = this.finalParagraphs;
          console.log('this.contract.paragraphList');
          console.log(this.contract.paragraphList);
          console.log('this.finalParagraphs');
          console.log(this.finalParagraphs);
          // tslint:disable-next-line:max-line-length
          this.apiService.putRequest(this.configLoader.configuration.backend + 'api/contracts/update?company=' + this.firstFormGroup.get('companyCtrl').value.shortName, this.contract, encryptionPassword).subscribe((contractResponse: any) => {
            // this.contract = contractResponse;
            const responseContract: Contract = contractResponse;
            responseContract.id = this.contract.id;
            console.log(contractResponse);
            responseContract.paragraphList = [];
            this.contract.paragraphList.forEach((paragraph: Paragraph) => {
              paragraph.contract = responseContract;
            });
            console.log(this.contract.paragraphList);
            // tslint:disable-next-line:max-line-length
            // this.apiService.putRequest(this.configLoader.configuration.backend + 'api/updateParagraphList', this.contract.paragraphList, encryptionPassword).subscribe((paragraphResponse: any) => {
            //  this.contract.paragraphList = paragraphResponse;
            //  console.log(this.contract);
            this.hideOverlay();
            this.loadingService.setLoading(false);
            this.router.navigate(['liste']);
            // });
          });
        } else {
          this.snackbar.openSnackbarFromComponent('Candidate konnte nicht gespeichert werden.', 5000);
        }
      });
    }
  }

  /*toggleSelected(inputParagraph: InputParagraph): void {
    inputParagraph.isSelected = !inputParagraph.isSelected;
    console.log(inputParagraph.isSelected);
  }*/

  createFormControls(): void {
    console.log('clean before test:');
    console.log(this.cleanParagraphs);
    this.fourthFormGroup = new FormGroup({});
    this.cleanParagraphs.forEach((input: Paragraph) => {
      let formGroup: FormGroup = new FormGroup({});
      if (input.contentFields === undefined) {
        console.log('#2: paragraph does not have any fields');
      } else {
        input.contentFields.forEach((inputfield: ContentField) => {
          if (inputfield.fieldType.match('AUSWAHL')) {
            inputfield.fieldOptions = inputfield.fieldName.split(' \/ ');
          } else {
            inputfield.fieldOptions = [];
          }
          console.log('inputfield.fieldName: ' + inputfield.fieldName);
          console.log('inputfield.paragraphId: ' + inputfield.paragraphId);
          console.log('fieldValue: ' + inputfield.fieldValue);
          inputfield.formControlName = inputfield.fieldName + inputfield.paragraphId;
          formGroup = this.addFormControlWithModifiedField(inputfield.fieldName, inputfield.paragraphId, inputfield.fieldValue, formGroup, inputfield.fieldType);
        });
      }
      if (input.optionalContents === undefined) {
        console.log('optionalContents do not exist');
      } else {
        input.optionalContents.forEach((optionalContent: OptionalContent) => {
          if (optionalContent.optionalContentFields === undefined ) {
            console.log('optionalContent does not have any fields');
          } else {
            optionalContent.optionalContentFields.forEach((optionalContentField: OptionalContentField) => {
              if (optionalContentField.fieldName === 'Treueprämie' && optionalContentField.fieldValue !== null && optionalContentField.fieldValue !== undefined && optionalContentField.fieldValue !== '') {
                this.hasLoyaltyBonus = true;
              }
              console.log('optionalContentField.fieldName: ' + optionalContentField.fieldName);
              console.log('optionalContentField.fieldValue: ' + optionalContentField.fieldValue);
              // tslint:disable-next-line:max-line-length
              optionalContentField.formControlName = optionalContentField.fieldName + optionalContentField.optionalContentId;
              formGroup = this.addFormControlOptionalContentFields(optionalContentField.fieldName, optionalContentField.optionalContentId, optionalContentField.fieldValue, formGroup);
              console.log(optionalContent.optionalContentFields);
            });
          }
        });
      }
      this.fourthFormGroup.addControl(input.paragraphNumber, formGroup);
    });
    this.areFormControlsReady = true;
    console.log('clean after test:');
    console.log(this.cleanParagraphs);
  }

  addFormControlWithModifiedField(controlName: string, id: number, input: string, formGroup: FormGroup, fieldType: string): FormGroup {
    if (input === undefined) {
      formGroup.addControl(controlName + id, new FormControl('', Validators.required));
      return formGroup;
    } else {
      if (fieldType.match('DATUM') && input !== null) {
        let dateValueArray: string[] = input.split('.');
        formGroup.addControl(controlName + id, new FormControl(new Date(Number(dateValueArray[2]), Number(dateValueArray[1]) - 1, Number(dateValueArray[0]), 12), Validators.required));
        console.log('entered Date' + new Date(Number(dateValueArray[2]), Number(dateValueArray[1]) - 1, Number(dateValueArray[0]), 12));
        return formGroup;
      } else if (fieldType.match('DATUM') && (input === null || input === '')) {
        formGroup.addControl(controlName + id, new FormControl('', Validators.required));
        return formGroup;
      }
      formGroup.addControl(controlName + id, new FormControl(input, Validators.required));
      return formGroup;
    }
  }

  addFormControlOptionalContentFields(controlName: string, id: number, input: string, formGroup: FormGroup): FormGroup {
    if (input === undefined) {
      if (controlName === 'Treueprämie') {
        let formControl: FormControl = new FormControl('');
        formControl.disable();
        formGroup.addControl(controlName + id, formControl);
        return formGroup;
      } else if (controlName === 'Prämie/-n') {
        let formControl: FormControl = new FormControl('');
        formControl.disable();
        formGroup.addControl(controlName + id, formControl);
        return formGroup;
      } else {
        formGroup.addControl(controlName + id, new FormControl(''));
        return formGroup;
      }
    } else {
      if (controlName.match(this.dateRegex) && input !== null && input !== '') {
        let dateValueArray2: string[] = input.split('.');
        formGroup.addControl(controlName + id, new FormControl(new Date(Number(dateValueArray2[2]), Number(dateValueArray2[1]) - 1, Number(dateValueArray2[0]), 12)));
        console.log('entered Date (optional)' + new Date(Number(dateValueArray2[2]), Number(dateValueArray2[1]) - 1, Number(dateValueArray2[0]), 12));
        return formGroup;
      } else if (controlName.match(this.dateRegex) && (input === null || input === '')) {
        formGroup.addControl(controlName + id, new FormControl(''));
        return formGroup;
      } else if (controlName === 'Treueprämie' && (input === null || input === '')) {
        let formControl: FormControl = new FormControl('');
        formControl.disable();
        formGroup.addControl(controlName + id, formControl);
        return formGroup;
      } else if (controlName === 'Prämie/-n' && (input === null || input === '')) {
        let formControl: FormControl = new FormControl('');
        formControl.disable();
        formGroup.addControl(controlName + id, formControl);
        return formGroup;
      }
      formGroup.addControl(controlName + id, new FormControl(input));
      return formGroup;
    }
  }

  optionalContentNotNull(paragraph: Paragraph): boolean {
    if (paragraph.optionalContents === undefined || paragraph.optionalContents.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  toggleOptionalSelected(optional: OptionalContent, paragraph: Paragraph): void {
    optional.selected = !optional.selected;
    if (optional.optionalContentFields !== undefined ) {
      if (optional.selected === true) {
        optional.optionalContentFields.forEach((optionalInputField: OptionalContentField) => {
          this.fourthFormGroup.get(paragraph.paragraphNumber)['controls'][optionalInputField.formControlName].setValidators([Validators.required]);
        });
      } else {
        optional.optionalContentFields.forEach((optionalInputField: OptionalContentField) => {
          this.fourthFormGroup.get(paragraph.paragraphNumber)['controls'][optionalInputField.formControlName].setValidators([]);
        });
      }
    }
    if (paragraph.selectionGroups && optional.selected === true) {
      for (const optionalContent of paragraph.optionalContents) {
        if (optionalContent !== optional && optional.selectionGroup === optionalContent.selectionGroup && optionalContent.selected === true) {
          optionalContent.selected = false;
          if (optionalContent.optionalContentFields !== undefined ) {
            optionalContent.optionalContentFields.forEach((optionalInputField: OptionalContentField) => {
              this.fourthFormGroup.get(paragraph.paragraphNumber)['controls'][optionalInputField.formControlName].setValidators([]);
            });
          }
        }
      }
    }
  }

  toggleLoyaltyBonus(paragraphNumber: string, formControlname: string): void {
    this.hasLoyaltyBonus = !this.hasLoyaltyBonus;
    if (this.hasLoyaltyBonus) {
      this.fourthFormGroup.get(paragraphNumber)['controls'][formControlname].setValidators([Validators.required]);
      this.fourthFormGroup.get(paragraphNumber)['controls'][formControlname].enable();
    } else {
      this.fourthFormGroup.get(paragraphNumber)['controls'][formControlname].setValidators([]);
      this.fourthFormGroup.get(paragraphNumber)['controls'][formControlname].disable();
    }
  }

  toggleBonus(paragraphNumber: string, formControlname: string): void {
    this.hasBonus = !this.hasBonus;
    if (this.hasBonus) {
      this.fourthFormGroup.get(paragraphNumber)['controls'][formControlname].setValidators([Validators.required]);
      this.fourthFormGroup.get(paragraphNumber)['controls'][formControlname].enable();
    } else {
      this.fourthFormGroup.get(paragraphNumber)['controls'][formControlname].setValidators([]);
      this.fourthFormGroup.get(paragraphNumber)['controls'][formControlname].disable();
    }
  }

  addLeadingZero(dateNumber: number): string {
    return dateNumber.toString().padStart(2, '0');
  }

  formatDate(date: Date): string {
    return [
      this.addLeadingZero(date.getDate()),
      this.addLeadingZero(date.getMonth() + 1),
      date.getFullYear(),
    ].join('.');
  }

  toggleAlternativeAddressInput(): void {
    this.alternativeAddressInput = !this.alternativeAddressInput;
    if (this.alternativeAddressInput) {
      this.secondFormGroup.removeControl('street');
      this.secondFormGroup.removeControl('streetnumber');
      this.secondFormGroup.removeControl('zipcode');
      this.secondFormGroup.removeControl('residence');
      this.secondFormGroup.addControl('firstRow', new FormControl('', Validators.required));
    } else {
      this.secondFormGroup.addControl('street', new FormControl('', Validators.required));
      this.secondFormGroup.addControl('streetnumber', new FormControl('', Validators.required));
      this.secondFormGroup.addControl('zipcode', new FormControl('', Validators.required));
      this.secondFormGroup.addControl('residence', new FormControl('', Validators.required));
      this.secondFormGroup.removeControl('firstRow');
    }
  }
}
