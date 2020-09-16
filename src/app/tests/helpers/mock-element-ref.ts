import { Injectable, ElementRef } from "@angular/core";

@Injectable()
export class MockElementRef extends ElementRef {
  constructor() {
    let el = document.createElement('div')
    super(el);
  }
}
