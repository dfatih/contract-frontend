import {CompanyLocation} from './companyLocation';
import {Links} from '../../hal/link';

export class Company {
  public companyId: number;
  public companyName: string;
  public shortName: string;
  public companyLocations: CompanyLocation[];
  public _links: Links;
}
