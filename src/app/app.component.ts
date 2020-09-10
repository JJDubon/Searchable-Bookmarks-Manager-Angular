import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import { takeUntil } from 'rxjs/operators';
import { ComponentBase } from './components/component-base';
import { BookmarksService } from './services/bookmarks/bookmarks.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends ComponentBase implements OnInit, AfterViewInit, OnDestroy {

  public initialized = false;
  public loadingError = false;
  public topLevelIds: string[] = [];

  private hasOverscroll = false;
  private overscrollObserver = new ResizeObserver(() => this.calcOverscroll());

  constructor(
    @Inject(DOCUMENT) private document: any,
    private cd: ChangeDetectorRef, 
    private bookmarksService: BookmarksService) {
    super();
  }

  public ngOnInit(): void {
    
    // When the bookmarks tree has initialized, read the ids of the highest level nodes ("Bookmarks Bar", "Other Bookmarks", etc...)
    this.bookmarksService.initialized$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.initialized = true;
      this.cd.detectChanges();
    }, error => {
      console.error(error);
      this.loadingError = true;
    });

    // Store the ids that are the entry point to the bookmarks tree
    this.bookmarksService.topLevelIds$.pipe(takeUntil(this.onDestroy$)).subscribe(ids => {
      this.topLevelIds = ids;
      this.cd.detectChanges();
    });

  }

  public ngAfterViewInit(): void {
    this.calcOverscroll();
    this.overscrollObserver.observe(this.document.querySelector("html"));
  }

  public ngOnDestroy(): void {
    this.overscrollObserver.disconnect();
  }

  private calcOverscroll(): void {
    const windowHeight = window.innerHeight;
    const contentHeight = Math.floor(this.document.querySelector("html").getBoundingClientRect().height);
    const hasOverscroll = windowHeight < contentHeight && windowHeight != contentHeight;
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
