import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique',
})
export class UniquePipe implements PipeTransform {

  transform(input: string[]): any {
    // Remove the duplicate elements
    return [...new Set(input)];
  }
}
