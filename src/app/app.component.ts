import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ComponentBase } from './components/component-base';
import { BookmarksService } from './services/bookmarks/bookmarks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends ComponentBase implements OnInit {

  public topLevelIds: string[] = [];
  public initialized = false;
  public loadingError = false;

  constructor(private cd: ChangeDetectorRef, private bookmarksService: BookmarksService) {
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
  
}
