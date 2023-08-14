import {Paragraph} from './paragraph.model';
import {ContentField} from './contentField';
import {OptionalContentField} from './optionalContentField';
import {Links} from '../../hal/link';

export class OptionalContent {

  public id: number;
  public title: string;
  public shortName: string;
  public content: string;
  public selected: boolean;
  public modified: boolean;
  public paragraph: Paragraph;
  public optionalContentFields: OptionalContentField[];
  public paragraphNumber: string;
  public contractVersionName: string;
  public versionTemplateName: string;
  public language: string;
  public selectionGroup: number;
  public _links: Links;
}
