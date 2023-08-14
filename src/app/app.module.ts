import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {ErstellenComponent} from './erstellen/erstellen.component';
import {HochladenComponent} from './hochladen/hochladen.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ContractListComponent} from './contract-list/contract-list.component';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatSortModule} from '@angular/material/sort';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {NavbarComponent} from './navbar/navbar.component';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DemoMaterialModule} from './hochladen/material-module';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {FileUploaderService} from './file-upload/file-uploader.service';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AppRoutingModule} from './app-routing.module';
import {ConfigAssetLoaderService} from './services/configuration.service';
import {VertragsversionComponent} from './vertragsversion/vertragsversion.component';
import {QuillModule} from 'ngx-quill';
import {MatDividerModule} from '@angular/material/divider';
import {UniquePipe} from './unique.pipe';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SpecialagreementsDialogComponent} from './specialagreements-dialog/specialagreements-dialog.component';
import {PasswordDialogComponent} from './password-dialog/password-dialog.component';
import { SigneeDialogComponent } from './signee-dialog/signee-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ErrorSnackbarComponent} from './widgets/error-snackbar/error-snackbar.component';
import {SnackbarService} from './services/snackbar.service';
import {AuthInterceptor} from './utils/authInterceptor';
import { SpecialagreementEditDialogComponent } from './specialagreement-edit-dialog/specialagreement-edit-dialog.component';
import { FillerComponent } from './filler/filler.component';
import {OverlayModule} from '@angular/cdk/overlay';


@NgModule({
  declarations: [
    NavbarComponent,
    AppComponent,
    ErstellenComponent,
    HochladenComponent,
    PageNotFoundComponent,
    ContractListComponent,
    PageNotFoundComponent,
    FileUploadComponent,
    VertragsversionComponent,
    UniquePipe,
    PasswordDialogComponent,
    SpecialagreementsDialogComponent,
    SigneeDialogComponent,
    ErrorSnackbarComponent,
    SpecialagreementEditDialogComponent,
    FillerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatPaginatorModule,
    HttpClientModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatStepperModule,
    MatDividerModule,
    MatDialogModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    AppRoutingModule,
    QuillModule.forRoot(),
    OverlayModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [HochladenComponent,
    SpecialagreementsDialogComponent,
  ErrorSnackbarComponent,
    SigneeDialogComponent,
    SpecialagreementEditDialogComponent
  ],
  providers: [
    HttpClientModule,
    SnackbarService,
    FileUploaderService,
    ConfigAssetLoaderService,
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'de-DE'
    },
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigAssetLoaderService) => () => configService.loadConfigurations().toPromise(),
      deps: [ConfigAssetLoaderService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
