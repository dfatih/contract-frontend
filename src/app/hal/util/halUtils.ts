import { Links } from '../link';

export class HalUtils {

  public static links(links: Links): RelationValidator {
    return new RelationValidator(links);
  }

  public static removeLinkTemplate(href: string): string {
    return href.replace(/{.*}/, '');
  }

}

class RelationValidator {

  links: Links;

  constructor(links: Links) {
    this.links = links;
  }

  public isRelationPresent(relation: string): boolean {
    return this.links !== undefined && this.links[relation] !== undefined;
  }

}
