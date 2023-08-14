import {Contract} from './contract.model';
import {OptionalContent} from './optionalContent';
import {ContentField} from './contentField';
import {Links} from '../../hal/link';

export class Paragraph{

  public id: number;
  public contract: Contract;
  public paragraphNumber: string;
  public paragraphTitle: string;
  public paragraphContent: string;
  public template: boolean;
  public clean: boolean;
  public language: string;
  public contractVersionName: string;
  public versionTemplateName: string;
  public optionalContents: OptionalContent[];
  public contentFields: ContentField[];
  public selected: boolean;
  public selectionGroups: boolean;
  public _links: Links;
}
