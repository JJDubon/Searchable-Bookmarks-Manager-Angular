import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';

@Component({
  selector: 'app-bookmark-folder',
  templateUrl: './bookmark-folder.component.html',
  styleUrls: ['./bookmark-folder.component.css']
})
export class BookmarkFolderComponent implements OnInit {

  @Input() public bookmarkId: string;
  public bookmark: BookmarkFolderModel;

  constructor(private cd: ChangeDetectorRef, private bookmarksService: BookmarksService) { }

  public ngOnInit(): void {
    this.bookmark = this.bookmarksService.getBookmark(this.bookmarkId) as BookmarkFolderModel;
  }

}
