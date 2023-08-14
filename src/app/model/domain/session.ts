import {Contract} from './contract.model';
import {JwtToken} from './jwtToken';
import {ContractVersion} from './contractVersion';

export class Session {
  token: JwtToken;
  public currentContract: Contract;
  public contractVersions: ContractVersion[];
  public selectedContractVersionName: string;
  public selectedVersionTemplateName: string;
}
