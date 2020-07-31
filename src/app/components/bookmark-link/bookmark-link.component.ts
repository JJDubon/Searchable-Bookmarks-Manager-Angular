import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';

@Component({
  selector: 'app-bookmark-link',
  templateUrl: './bookmark-link.component.html',
  styleUrls: ['./bookmark-link.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkLinkComponent implements OnInit {

  @Input() public bookmarkId: string;
  public bookmark: BookmarkLinkModel;

  constructor(private cd: ChangeDetectorRef, private bookmarksService: BookmarksService) { }

  public ngOnInit(): void {
    this.bookmark = this.bookmarksService.getBookmark(this.bookmarkId) as BookmarkLinkModel;
  }

}
