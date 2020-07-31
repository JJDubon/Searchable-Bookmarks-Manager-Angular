import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarkTypes } from 'src/app/models/bookmark-types.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';

@Component({
  selector: 'app-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.css']
})
export class BookmarkListComponent implements OnInit, OnChanges {

  @Input() public bookmarkIds: string[];
  public bookmarks: BookmarkBaseModel[];
  public BookmarkTypes = BookmarkTypes;

  constructor(private cd: ChangeDetectorRef, private bookmarksService: BookmarksService) { }

  public ngOnInit(): void {
    
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log("changes", changes);
    if (changes.bookmarkIds && this.bookmarkIds) {
      this.loadBookmarks();
    }
  }

  public loadBookmarks(): void {
    this.bookmarks = (this.bookmarkIds ?? []).map(id => this.bookmarksService.getBookmark(id));
    this.cd.detectChanges();
  }

}
