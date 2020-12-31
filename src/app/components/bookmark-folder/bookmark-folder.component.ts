import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, takeUntil } from 'rxjs/operators';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { ClipboardService } from 'src/app/services/clipboard/clipboard.service';
import { ContextMenuItem, ContextMenuService } from 'src/app/services/context-menu/context-menu.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ComponentBase } from '../component-base';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { BookmarkFolderAddFolderDialogComponent } from './bookmark-folder-add-folder-dialog/bookmark-folder-add-folder-dialog.component';
import { BookmarkFolderAddLinkDialogComponent } from './bookmark-folder-add-link-dialog/bookmark-folder-add-link-dialog.component';
import { BookmarkFolderDeleteDialogComponent } from './bookmark-folder-delete-dialog/bookmark-folder-delete-dialog.component';
import { BookmarkFolderEditDialogComponent } from './bookmark-folder-edit-dialog/bookmark-folder-edit-dialog.component';

const toggleAnimation =
  trigger('toggle', [
    state('open', style({
      height: '*'
    })),
    state('closed', style({
      height: '0px'
    })),
    transition('open => closed', [
      animate('100ms ease-in-out')
    ]),
    transition('closed => open', [
      animate('100ms ease-in-out')
    ])
  ]);

@Component({
  selector: 'app-bookmark-folder',
  templateUrl: './bookmark-folder.component.html',
  styleUrls: ['./bookmark-folder.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [toggleAnimation]
})
export class BookmarkFolderComponent extends ComponentBase implements OnInit {

  @Input() public bookmarkId: string;
  @ViewChild(ContextMenuComponent) public contextMenu: ContextMenuComponent;

  public bookmark: BookmarkFolderModel;
  public state: 'open' | 'closed' = 'closed';
  public visible = true;

  private isOpenByDefault = false;

  constructor(
    private cd: ChangeDetectorRef, 
    private zone: NgZone,
    private dialog: MatDialog, 
    private contextMenuService: ContextMenuService,
    private bookmarksService: BookmarksService,
    private storageService: StorageService,
    private clipboardService: ClipboardService) { 
    super();
  }

  public ngOnInit(): void {

    // Retrieve the bookmark from the service and subscribe to any changes to the bookmark
    this.bookmark = this.bookmarksService.getBookmark(this.bookmarkId) as BookmarkFolderModel;
    this.bookmarksService.bookmarkChanged$.pipe(filter(b => b.id === this.bookmark.id)).pipe(takeUntil(this.onDestroy$)).subscribe(bookmark => {
      this.bookmark = bookmark as BookmarkFolderModel;
      this.state = this.bookmark.isOpen ? 'open' : 'closed';
      if (this.state === 'open') {
        this.visible = true;
      }

      this.cd.detectChanges();
    });

    // Set the default open/close state
    this.state = this.bookmark.isOpen ? 'open' : 'closed';
    this.visible = this.bookmark.isOpen;

    // Give the user the ability to mark any folder as open by default
    this.storageService.getOpenByDefault(this.bookmarkId).pipe(takeUntil(this.onDestroy$)).subscribe((isOpenByDefault) => {
      this.isOpenByDefault = isOpenByDefault;
    });

  }

  public toggleState(): void {
    this.bookmarksService.toggleFolderOpenOrClosed(this.bookmarkId);
  }

  public onAnimationDone(): void {
    if (this.state === 'closed') {
      this.visible = false;
      this.cd.detectChanges();
    }
  }

  public triggerContextMenu(ev: MouseEvent): void {

    ev.preventDefault();

    let contextMenuOptions: ContextMenuItem[] = [];

    contextMenuOptions.push({ id: 'addFolder', text: 'Add Folder' });
    contextMenuOptions.push({ id: 'addBookmark', text: 'Add Bookmark' });

    if (this.bookmark.modifiable) {
      contextMenuOptions.push({ id: 'copyBookmark', text: 'Copy', topSeparator: true });
      contextMenuOptions.push({ id: 'cutBookmark', text: 'Cut' });
    }

    if (this.clipboardService.getClipboard()) {
      contextMenuOptions.push({ id: 'pasteBookmark', text: 'Paste', topSeparator: !this.bookmark.modifiable });
    }

    if (this.bookmark.modifiable) {
      contextMenuOptions.push({ id: 'editFolder', text: 'Edit Folder', topSeparator: true });
      contextMenuOptions.push({ id: 'deleteFolder', text: 'Delete Folder' });
    }

    contextMenuOptions.push({ id: 'toggleDefaultOpenState', text: this.isOpenByDefault ? 'Set Closed By Default' : 'Set Open By Default', topSeparator: true });

    this.contextMenuService.openContextMenu(contextMenuOptions).pipe(takeUntil(this.onDestroy$)).subscribe(selectedOptionId => {
      this.contextItemSelected(selectedOptionId)
    });

  }

  private contextItemSelected(id: string): void {
    this.zone.run(() => {

      switch (id) {
        case 'addFolder':
          this.addFolderDialog();
          break;
        case 'addBookmark':
          this.addBookmarkDialog();
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
        case 'deleteFolder':
          this.openDeleteDialog();
          break;
        case 'editFolder':
          this.openEditDialog();
          break;
        case 'toggleDefaultOpenState':
          this.toggleDefaultOpenState();
          break;
      }

    });
  }

  private addFolderDialog(): void {
    const dialogRef = this.dialog.open(BookmarkFolderAddFolderDialogComponent, {
      width: '320px',
      autoFocus: true,
      data: { title: '' }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe((result: { title: string }) => {
      if (result) {
        this.bookmarksService.createBookmark(this.bookmark.id, result.title ?? '', null, 0);
      }
    });
  }

  private addBookmarkDialog(): void {
    const dialogRef = this.dialog.open(BookmarkFolderAddLinkDialogComponent, {
      width: '320px',
      autoFocus: true,
      data: { title: '', url: '' }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe((result: { title: string, url: string }) => {
      if (result) {
        this.bookmarksService.createBookmark(this.bookmark.id, result.title ?? '', result.url ?? '', 0);
      }
    });
  }

  private openDeleteDialog(): void {
    const dialogRef = this.dialog.open(BookmarkFolderDeleteDialogComponent, {
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
    const dialogRef = this.dialog.open(BookmarkFolderEditDialogComponent, {
      width: '320px',
      autoFocus: true,
      data: { title: this.bookmark.title }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe((result: { title: string, action: string }) => {
      if (result.action === 'delete') {
        this.bookmarksService.removeFolder(this.bookmark.id);
      } else if (result.action === 'save') {
        this.bookmarksService.updateBookmark(this.bookmark.id, { title: result.title });
      }
    });
  }

  private toggleDefaultOpenState(): void {
    this.storageService.getOpenByDefault(this.bookmarkId).pipe(takeUntil(this.onDestroy$)).subscribe(isOpenByDefault => {
      if (isOpenByDefault) {
        this.storageService.storeClosedByDefault(this.bookmarkId).subscribe();
      } else {
        this.storageService.storeOpenByDefault(this.bookmarkId).subscribe();
      }

      this.isOpenByDefault = isOpenByDefault;
    });
  }

}
