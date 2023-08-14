import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ConfigAssetLoaderService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  constructor(
    private http: HttpClient,
    private configLoader: ConfigAssetLoaderService) {
  }

  deleteContract(id): void {
    this.http.delete(this.configLoader.configuration.backend + 'api/deleteContractById?id=' + id, {withCredentials: true}).subscribe(() => {
      window.location.reload();
    });
  }

  deleteCandidate(id): void {
    // tslint:disable-next-line:max-line-length
    this.http.delete(this.configLoader.configuration.backend + 'api/deleteCandidateById?id=' + id, {withCredentials: true}).subscribe(() => {
      window.location.reload();
    });
  }
}
