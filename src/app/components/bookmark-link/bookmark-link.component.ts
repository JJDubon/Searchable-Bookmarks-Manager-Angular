import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { ContextMenuService , ContextMenuItem} from 'src/app/services/context-menu/context-menu.service';
import { ComponentBase } from '../component-base';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'app-bookmark-link',
  templateUrl: './bookmark-link.component.html',
  styleUrls: ['./bookmark-link.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkLinkComponent extends ComponentBase implements OnInit {

  @Input() public bookmarkId: string;
  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;

  public bookmark: BookmarkLinkModel;
  public contextMenuOptions: ContextMenuItem[];

  constructor(
    private cd: ChangeDetectorRef, 
    private zone: NgZone, 
    private contextMenuService: ContextMenuService,
    private bookmarksService: BookmarksService) {
    super();
  }

  public ngOnInit(): void {

    // Retrieve the bookmark from the service and subscribe to any changes to the bookmark
    this.bookmark = this.bookmarksService.getBookmark(this.bookmarkId) as BookmarkLinkModel;
    this.bookmarksService.bookmarkChanged$.pipe(filter(b => b.id === this.bookmark.id)).pipe(takeUntil(this.onDestroy$)).subscribe(bookmark => {
      this.bookmark = bookmark as BookmarkLinkModel;
      this.cd.detectChanges();
    });

    // Determine which context menu options this link will display
    this.contextMenuOptions = [];
    this.contextMenuOptions.push({ id: 'openCurrentTab', text: 'Open in Current Tab' });
    this.contextMenuOptions.push({ id: 'openNewTab', text: 'Open in New Tab' });
    this.contextMenuOptions.push({ id: 'openNewWindow', text: 'Open in New Window' });
    this.contextMenuOptions.push({ id: 'openNewIWindow', text: 'Open in New Incognito Window' });
    if (this.bookmark.modifiable) {
      this.contextMenuOptions.push({ id: 'editBookmark', text: 'Edit Bookmark' });
      this.contextMenuOptions.push({ id: 'deleteBookmark', text: 'Delete Bookmark' });
    }

  }

  public triggerContextMenu(ev: MouseEvent): void {
    ev.preventDefault();
    this.contextMenuService.openContextMenu(this.contextMenuOptions).pipe(takeUntil(this.onDestroy$)).subscribe(selectedOptionId => {
      this.contextItemSelected(selectedOptionId)
    });
  }

  private contextItemSelected(id: string): void {
    this.zone.run(() => {

      switch (id) {
        case 'openCurrentTab':
          // TODO
          break;
        case 'openNewTab':
          // TODO
          break;
        case 'openNewWindow':
          // TODO
          break;
        case 'openNewIWindow':
          // TODO
          break;
        case 'editBookmark':
          // TODO
          break;
        case 'deleteBookmark':
          // TODO
          break;
      }

    });
  }

}
