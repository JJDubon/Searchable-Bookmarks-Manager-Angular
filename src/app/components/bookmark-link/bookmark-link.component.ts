import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, takeUntil } from 'rxjs/operators';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { ContextMenuItem, ContextMenuService } from 'src/app/services/context-menu/context-menu.service';
import { DragService } from 'src/app/services/drag/drag.service';
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
  public contextMenuOptions: ContextMenuItem[];
  public dragging = false;

  constructor(
    private cd: ChangeDetectorRef, 
    private zone: NgZone, 
    private dialog: MatDialog,
    private dragService: DragService,
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

    // Fade on drag start
    this.dragService.dragTarget$.pipe(takeUntil(this.onDestroy$)).subscribe((target) => {
      if (target == null && this.dragging) {
        this.dragging = false;
        this.cd.detectChanges();
      } else if (target?.id === this.bookmark.id) {
        this.dragging = true;
        this.cd.detectChanges();
      }
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

  private openEditDialog() {
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
