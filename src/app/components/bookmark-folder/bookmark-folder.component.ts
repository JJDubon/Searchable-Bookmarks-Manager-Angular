import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';

@Component({
  selector: 'app-bookmark-folder',
  templateUrl: './bookmark-folder.component.html',
  styleUrls: ['./bookmark-folder.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toggle', [
      state('open', style({
        height: '*',
        transform: 'scaleY(1)'
      })),
      state('closed', style({
        height: '0px',
        transform: 'scaleY(0)'
      })),
      transition('open => closed', [
        animate('150ms ease-in-out')
      ]),
      transition('closed => open', [
        animate('150ms ease-in-out')
      ])
    ])
  ]
})
export class BookmarkFolderComponent implements OnInit {

  @Input() public bookmarkId: string;
  @Input() public defaultState: 'open' | 'closed' = 'open';

  public bookmark: BookmarkFolderModel;
  public state: 'open' | 'closed' = this.defaultState;

  constructor(private cd: ChangeDetectorRef, private bookmarksService: BookmarksService) { }

  public ngOnInit(): void {
    this.bookmark = this.bookmarksService.getBookmark(this.bookmarkId) as BookmarkFolderModel;
  }

  public toggleState(): void {
    this.state = (this.state === 'open') ? 'closed' : 'open';
    this.cd.detectChanges();
  }

}
