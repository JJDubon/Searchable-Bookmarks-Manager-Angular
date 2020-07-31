import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { ComponentBase } from '../component-base';

@Component({
  selector: 'app-bookmark-link',
  templateUrl: './bookmark-link.component.html',
  styleUrls: ['./bookmark-link.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkLinkComponent extends ComponentBase implements OnInit {

  @Input() public bookmarkId: string;
  public bookmark: BookmarkLinkModel;

  constructor(private cd: ChangeDetectorRef, private bookmarksService: BookmarksService) {
    super();
  }

  public ngOnInit(): void {

    // Retrieve the bookmark from the service and subscribe to any changes to the bookmark
    this.bookmark = this.bookmarksService.getBookmark(this.bookmarkId) as BookmarkLinkModel;
    this.bookmarksService.bookmarkChanged$.pipe(filter(b => b.id === this.bookmark.id)).pipe(takeUntil(this.onDestroy$)).subscribe(bookmark => {
      this.bookmark = bookmark as BookmarkLinkModel;
      this.cd.detectChanges();
    });

  }

}
