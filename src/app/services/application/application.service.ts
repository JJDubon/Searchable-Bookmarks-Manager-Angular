import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import { ApplicationSettings } from 'src/app/models/application-settings';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private hasOverscroll: boolean = null;
  private overscrollObserver = new ResizeObserver(() => this.calcOverscroll());

  constructor(
    @Inject(DOCUMENT) private document: any,
    private storageService: StorageService) { }

  public init(): void {
    this.applySettings();
    this.calcOverscroll();
    this.overscrollObserver.observe(this.document.querySelector("html"));
  }

  public destroy(): void {
    this.overscrollObserver.disconnect();
  }

  public applySettings(): void {
    this.storageService.getApplicationSettings().subscribe(settings => {
      document.querySelector('main').style.width = getExtensionWidth(settings);
      document.querySelector('html').style.fontSize = getRootFontSize(settings);
    });
  }

  private calcOverscroll(): void {
    const hasOverscroll = window.innerWidth > document.documentElement.clientWidth;
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
    case 'regular':
      return '12px';
    case 'large':
      return '16px';
  }
}
