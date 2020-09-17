import { ElementRef, Injectable } from "@angular/core";

@Injectable()
export class MockElementRef extends ElementRef<HTMLDivElement> {
  constructor() {
    let el = document.createElement('div')
    super(el);
  }
}
