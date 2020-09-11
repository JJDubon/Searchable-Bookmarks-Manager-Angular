import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ComponentBase } from './components/component-base';
import { ApplicationService } from './services/application/application.service';
import { BookmarksService } from './services/bookmarks/bookmarks.service';

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

  constructor(
    private cd: ChangeDetectorRef,
    private bookmarksService: BookmarksService,
    private applicationService: ApplicationService) {
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
    this.applicationService.init();
  }

  public ngOnDestroy(): void {
    this.applicationService.destroy();
  }
  
}
