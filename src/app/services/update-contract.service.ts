import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Contract} from '../model/domain/contract.model';
import { ConfigAssetLoaderService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateContractService {

  constructor(
    private http: HttpClient,
    private configLoader: ConfigAssetLoaderService) { }

  getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(this.configLoader.configuration.backend + 'contracts/' + id + '?projection=ContractWithParagraphs');
  }

  updateEmployee(id: number, contract: Contract): Observable<Object>{
    return this.http.put(this.configLoader.configuration.backend + 'api/viewAllContracts/' + id, contract);
  }
}
