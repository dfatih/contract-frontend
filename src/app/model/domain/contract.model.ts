import {Company} from './company';
import {Paragraph} from './paragraph.model';
import {Links} from '../../hal/link';
import {Candidate} from './candidate';
import {Signee} from './signee';

export class Contract {

  public id: number;
  public candidateId: number;
  public fileName: string;
  public lastEdit: Date;
  public companyId: number;
  public company: Company;
  public location: string;
  public template: string;
  public placeOfSignature: string;
  public dateOfSignature: Date;
  public signeeList: Signee[];
  public paragraphList: Paragraph[];
  public candidate: Candidate;
  public contractVersionName: string;
  public versionTemplateName: string;
  public _links: Links;

}
