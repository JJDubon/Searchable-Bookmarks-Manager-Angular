import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, takeUntil } from 'rxjs/operators';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { ContextMenuItem, ContextMenuService } from 'src/app/services/context-menu/context-menu.service';
import { ComponentBase } from '../component-base';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { BookmarkLinkDeleteDialogComponent } from './bookmark-link-delete-dialog/bookmark-link-delete-dialog.component';
import { BookmarkLinkEditDialogComponent } from './bookmark-link-edit-dialog/bookmark-link-edit-dialog.component';

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

  constructor(
    private cd: ChangeDetectorRef, 
    private zone: NgZone, 
    private dialog: MatDialog,
    private contextMenuService: ContextMenuService,
    private bookmarksService: BookmarksService,
    private clipboardService: ClipboardService) {
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

  public triggerContextMenu(ev: MouseEvent): void {

    ev.preventDefault();

    let contextMenuOptions: ContextMenuItem[] = [];

    contextMenuOptions.push({ id: 'openCurrentTab', text: 'Open in Current Tab' });
    contextMenuOptions.push({ id: 'openNewTab', text: 'Open in New Tab' });
    contextMenuOptions.push({ id: 'openNewWindow', text: 'Open in New Window' });
    contextMenuOptions.push({ id: 'openNewIWindow', text: 'Open in New Incognito Window' });

    if (this.bookmark.modifiable) {
      contextMenuOptions.push({ id: 'copyBookmark', text: 'Copy', topSeparator: true });
      contextMenuOptions.push({ id: 'cutBookmark', text: 'Cut' });
    }

    if (this.clipboardService.getClipboard()) {
      contextMenuOptions.push({ id: 'pasteBookmark', text: 'Paste', topSeparator: !this.bookmark.modifiable });
    }

    if (this.bookmark.modifiable) {
      contextMenuOptions.push({ id: 'editBookmark', text: 'Edit Bookmark', topSeparator: true });
      contextMenuOptions.push({ id: 'deleteBookmark', text: 'Delete Bookmark' });
    }

    this.contextMenuService.openContextMenu(contextMenuOptions).pipe(takeUntil(this.onDestroy$)).subscribe(selectedOptionId => {
      this.contextItemSelected(selectedOptionId)
    });

  }

  public openBookmark(ev: MouseEvent): void {
    if (ev.button === 0 && ev.ctrlKey) {
      this.bookmarksService.openInNewTab(this.bookmark);
    } else {
      this.bookmarksService.openInCurrentTab(this.bookmark);
    }
  }

  public openIfMiddleClick(ev: MouseEvent): void {
    if (ev.button === 1) {
      this.bookmarksService.openInNewTab(this.bookmark);
    }
  }

  private contextItemSelected(id: string): void {
    this.zone.run(() => {

      switch (id) {
        case 'openCurrentTab':
          this.bookmarksService.openInCurrentTab(this.bookmark);
          break;
        case 'openNewTab':
          this.bookmarksService.openInNewTab(this.bookmark);
          break;
        case 'openNewWindow':
          this.bookmarksService.openInNewWindow(this.bookmark);
          break;
        case 'openNewIWindow':
          this.bookmarksService.openInNewIWindow(this.bookmark);
          break;
        case 'copyBookmark':
          this.clipboardService.setClipboard(this.bookmark.id, 'copy');
          break;
        case 'cutBookmark':
          this.clipboardService.setClipboard(this.bookmark.id, 'cut');
          break;
        case 'pasteBookmark':
          this.clipboardService.pasteClipboard(this.bookmark.id);
          break;
        case 'editBookmark':
          this.openEditDialog();
          break;
        case 'deleteBookmark':
          this.openDeleteDialog();
          break;
      }

    });
  }

  private openDeleteDialog(): void {
    const dialogRef = this.dialog.open(BookmarkLinkDeleteDialogComponent, {
      width: '320px',
      autoFocus: true
    });

    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe((result: { delete: boolean }) => {
      if (result.delete === true) {
        this.bookmarksService.removeFolder(this.bookmark.id);
      }
    });
  }

  private openEditDialog(): void {
    const dialogRef = this.dialog.open(BookmarkLinkEditDialogComponent, {
      width: '320px',
      autoFocus: true,
      data: { title: this.bookmark.title, url: this.bookmark.url }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe((result: { title: string, url: string, action: string }) => {
      if (result.action === 'delete') {
        this.bookmarksService.removeBookmark(this.bookmark.id);
      } else if (result.action === 'save') {
        this.bookmarksService.updateBookmark(this.bookmark.id, { title: result.title, url: result.url });
      }
    });
  }

}
