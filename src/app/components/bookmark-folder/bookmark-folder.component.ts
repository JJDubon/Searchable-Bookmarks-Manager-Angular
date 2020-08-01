import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { ComponentBase } from '../component-base';
import { ContextMenuComponent, ContextMenuItem } from '../context-menu/context-menu.component';

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
export class BookmarkFolderComponent extends ComponentBase implements OnInit {

  @Input() public bookmarkId: string;
  @Input() public defaultState: 'open' | 'closed' = 'open';
  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;

  public bookmark: BookmarkFolderModel;
  public state: 'open' | 'closed' = this.defaultState;
  public contextMenuOptions: ContextMenuItem[];

  constructor(private cd: ChangeDetectorRef, private bookmarksService: BookmarksService) { 
    super();
  }

  public ngOnInit(): void {

    // Retrieve the bookmark from the service and subscribe to any changes to the bookmark
    this.bookmark = this.bookmarksService.getBookmark(this.bookmarkId) as BookmarkFolderModel;
    this.bookmarksService.bookmarkChanged$.pipe(filter(b => b.id === this.bookmark.id)).pipe(takeUntil(this.onDestroy$)).subscribe(bookmark => {
      this.bookmark = bookmark as BookmarkFolderModel;
      this.cd.detectChanges();
    });

    // Determine which context menu options this folder will display
    this.contextMenuOptions = [];
    this.contextMenuOptions.push({ id: 'newFolder', text: 'New Folder' });
    this.contextMenuOptions.push({ id: 'newBookmark', text: 'New Bookmark' });
    if (this.bookmark.modifiable) {
      this.contextMenuOptions.push({ id: 'editFolder', text: 'Edit Folder' });
      this.contextMenuOptions.push({ id: 'deleteFolder', text: 'Delete Folder' });
    }

  }

  public toggleState(): void {
    this.state = (this.state === 'open') ? 'closed' : 'open';
    this.cd.detectChanges();
  }

  public triggerContextMenu(ev: MouseEvent): void {
    this.contextMenu.open(ev);
  }

  public contextItemSelected(id: string): void {
    console.log("item selected", id); // TODO
  }

}
