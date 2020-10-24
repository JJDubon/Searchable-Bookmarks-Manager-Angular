import { DOCUMENT } from '@angular/common';
import { ApplicationRef, Inject, Injectable } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApplicationSettings } from 'src/app/models/application-settings';
import { WindowToken } from 'src/window';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private hasOverscroll: boolean = null;
  private overscrollObserver = new ResizeObserver(() => this.calcOverscroll());

  constructor(
    @Inject(WindowToken) private window: Window,
    @Inject(DOCUMENT) private document: Document,
    private appRef: ApplicationRef,
    private storageService: StorageService) { }

  public init(): void {
    this.applySettings().subscribe();
    this.calcOverscroll();
    this.overscrollObserver.observe(this.document.querySelector("html"));
  }

  public destroy(): void {
    this.overscrollObserver.disconnect();
  }

  public applySettings(): Observable<ApplicationSettings> {
    return this.storageService.getApplicationSettings().pipe(tap(settings => {
      this.document.querySelector('main').style.width = getExtensionWidth(settings);
      this.document.querySelector('html').style.fontSize = getRootFontSize(settings);
      this.appRef.tick();
    }));
  }

  private calcOverscroll(): void {
    const hasOverscroll = this.window.innerWidth > this.document.documentElement.clientWidth;
    if (this.hasOverscroll != hasOverscroll) {
      this.hasOverscroll = hasOverscroll;
      if (this.hasOverscroll) {
        this.document.querySelector("html").classList.add("has-overscroll");
      } else {
        this.document.querySelector("html").classList.remove("has-overscroll");
      }
    }
  }

}

function getExtensionWidth(settings: ApplicationSettings): string {
  switch (settings.pageWidth) {
    case 'regular':
      return '400px';
    case 'large':
      return '500px';
    case 'extra large':
      return '600px';
  }
}

function getRootFontSize(settings: ApplicationSettings): string {
  switch (settings.fontSize) {
    case 'compact':
      return '10px';
    case 'regular':
      return '12px';
    case 'large':
      return '16px';
  }
}
