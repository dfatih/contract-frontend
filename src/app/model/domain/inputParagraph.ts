import {OptionalContent} from './optionalContent';

export class InputParagraph {
  public paragraphId: number;
  public paragraphNumber: string;
  public paragraphTitle: string;
  public paragraphContent: string;
  public paragraphFields: string[];
  public modifiedFields: string[];
  public formControlNames: string[];
  public cleanParagraphTitle: string;
  public cleanParagraphContent: string;
  public isSelected: boolean;
  public optionalContent: OptionalContent[];
}
