import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'allowUnsafe'
})
export class AllowUnsafePipe implements PipeTransform {

  constructor (private sanitizer: DomSanitizer) {

  }

  public transform(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
