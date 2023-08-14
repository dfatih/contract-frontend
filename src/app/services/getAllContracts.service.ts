import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Contract} from '../model/domain/contract.model';
import {Overlay} from '@angular/cdk/overlay';
import {Candidate} from '../model/domain/candidate';
import { ConfigAssetLoaderService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class GetAllContractsService {

  constructor(
    private httpClient: HttpClient,
    private configLoader: ConfigAssetLoaderService) { }

   getAllContracts(): Observable<Contract[]>{
     return this.httpClient.get<Contract[]>(this.configLoader.configuration.backend + 'api/viewAllContracts', {withCredentials: true});  }


  getCandidate(contract: Contract): Observable<Candidate>{
    return this.httpClient.get<Candidate>(this.configLoader.configuration.backend + 'api/candidates/' + contract.candidateId); }

  }


