import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ComponentBase } from './components/component-base';
import { BookmarksService } from './services/bookmarks/bookmarks.service';
import ResizeObserver from 'resize-observer-polyfill';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends ComponentBase implements OnInit, AfterViewInit, OnDestroy {

  public topLevelIds: string[] = [];
  public initialized = false;
  public loadingError = false;

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
      this.topLevelIds = this.bookmarksService.getTopLevelIds();
      this.initialized = true;
      this.cd.detectChanges();
    }, error => {
      console.error(error);
      this.loadingError = true;
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
