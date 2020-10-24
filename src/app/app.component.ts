import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentBase } from './components/component-base';
import { ApplicationService } from './services/application/application.service';
import { BookmarksService } from './services/bookmarks/bookmarks.service';
import { KeyboardService } from './services/keyboard/keyboard.service';

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
    private keyboardService: KeyboardService,
    private applicationService: ApplicationService) {
    super();
  }

  public ngOnInit(): void {

    // When the bookmarks tree has initialized and application settings have loaded, allow the component to render
    forkJoin([this.applicationService.applySettings(), this.bookmarksService.initialized$]).subscribe(() => {
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
    this.keyboardService.init();
  }

  public ngOnDestroy(): void {
    this.applicationService.destroy();
    this.keyboardService.destroy();
  }
  
}
