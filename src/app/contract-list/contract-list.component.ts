import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Contract} from 'src/app/model/domain/contract.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GetAllContractsService} from '../services/getAllContracts.service';
import {DownloadFileService} from '../services/download-file.service';
import {saveAs} from 'file-saver';
import {Session} from '../model/domain/session';
import {SessionService} from '../services/session.service';
import {Router} from '@angular/router';
import {DeleteService} from '../services/delete.service';
import {ApiService} from '../services/api.service';
import {Candidate} from '../model/domain/candidate';
import {DownloadService} from '../services/download.service';
import {UpdateContractService} from '../services/update-contract.service';
import {SelectionModel} from '@angular/cdk/collections';
import {Observable, tap, throwError} from 'rxjs';
import { ConfigAssetLoaderService } from '../services/configuration.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';
import {Download} from "../model/domain/download";


@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.css']
})
export class ContractListComponent implements OnInit {
  dataSource: MatTableDataSource<Contract>;
  allContracts: Contract[];
  deleteIndex: number = null;
  candidateNames: string[];
  displayedColumns: string[] = ['select', 'company', 'versionTemplateName', 'contractVersionName', 'date', 'name', 'street', 'streetNumber', 'zipCode', 'residence', 'actions'];
  selection = new SelectionModel<Contract>(true, []);
  isListReady = false;
  isDownload = false;
  download$: Observable<Download>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient,
              private populateContractService: GetAllContractsService,
              private downloadFileService: DownloadFileService,
              public sessionService: SessionService,
              private router: Router,
              private deleteService: DeleteService,
              private apiService: ApiService,
              private downloadService: DownloadService,
              private updateService: UpdateContractService,
              private getAllContractService: GetAllContractsService,
              private configLoader: ConfigAssetLoaderService,
              private dialog: MatDialog)
{
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.allContracts = [];
    this.candidateNames = [];
  }

  // tslint:disable-next-line:typedef use-lifecycle-interface
  ngOnInit(): void{
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.apiService.getRequest(this.configLoader.configuration.backend + 'contracts').subscribe(
      async (data) => {
        // @ts-ignore
        for (const contractData of data._embedded.contracts) {
          // tslint:disable-next-line:max-line-length
          const ct = new Contract();
          ct.id = contractData.id;
          ct.candidateId = contractData.candidateId;
          ct.lastEdit = contractData.lastEdit;

          ct.fileName = contractData.fileName;
          ct.contractVersionName = contractData.contractVersionName;
          ct.versionTemplateName = contractData.versionTemplateName;

          this.getCandidate(contractData).subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            data => {
                  ct.candidate = data;
              },
          );
          this.apiService.getRequest(this.configLoader.configuration.backend + 'companies/' + contractData.companyId).subscribe((companyResponse: any) => {
            ct.company = companyResponse;
          });

          this.allContracts.push(ct);
          this.dataSource = new MatTableDataSource(this.allContracts);
        }
        this.isListReady = true;
      }
    );

    const sortState: Sort = {active: 'name', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }

  downloadContract(contract: Contract): void {
    console.log(contract);
    const dialogRef = this.dialog.open(PasswordDialogComponent, {data: {password: ''}});

    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.download$ = this.downloadService.download(this.configLoader.configuration.backend + 'pdf/' + contract.id + '?company=' + contract.company.shortName, result, contract.fileName);
      }
    });
  }

  openErstellenComponent(): void {
    const session: Session = this.sessionService.getSession();
    session.currentContract = new Contract();
    this.sessionService.setSession(session);
    this.router.navigate(['erstellen']);
  }

  deleteContract(id: number, candidateId: number ): void {

    console.log(candidateId);
    this.isListReady = false;
    this.deleteService
      .deleteCandidate(candidateId);

    this.deleteService
      .deleteContract(id);
    this.isListReady = true;
  }

  getCandidate(contract: Contract): Observable<any> {
    let candidate;
    return this.apiService.getRequest(this.configLoader.configuration.backend + 'api/candidates/' + contract.candidateId).pipe(
      tap(data => candidate = data)
    );
  }

  private setDialogData(selectedContract: Contract): Contract {
    let contract;
    if (selectedContract === undefined) {
      contract = new Contract();
    } else {
      contract = selectedContract;
    }
    return contract;
  }

  // tslint:disable-next-line:typedef
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  logSelection(): void {
    this.selection.selected.forEach(s => console.log(s.candidateId + ' LOGCHECK SELECTION '));
  }

  // tslint:disable-next-line:typedef
    applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
  // tslint:disable-next-line:typedef
  editContact(id: number, shortName: string) {
    this.router.navigate(['bearbeiten', id, shortName]);
  }
}
