import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { BookmarksService } from '../bookmarks/bookmarks.service';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  public itemId$ = new BehaviorSubject<string>(null);
  private itemId: string = null;
  private clipboardType: 'copy' | 'cut' = null;

  constructor(private bookmarksService: BookmarksService) { }

  public setClipboard(id: string, type: 'copy' | 'cut'): void {
    this.itemId = id;
    this.itemId$.next(id);
    this.clipboardType = type;
  }

  public getClipboard(): BookmarkBaseModel {
    if (this.itemId) {
      return this.bookmarksService.getBookmark(this.itemId);
    } else {
      return null;
    }
  }

  public pasteClipboard(targetId: string): void {

    let target = this.bookmarksService.getBookmark(targetId);
    let item = this.bookmarksService.getBookmark(this.itemId);
    let title = item.title;
    let url = item instanceof BookmarkLinkModel ? item.url : null;
    
    if (this.clipboardType === 'copy') {

      // Create a new bookmark inside of the folder, or just under a link entry
      if (target instanceof BookmarkFolderModel) {
        this.bookmarksService.createBookmark(target.id, title, url, 0);
      } else {
        let parent = this.bookmarksService.getBookmark(target.parentId) as BookmarkFolderModel;
        let index = parent.children.indexOf(target.id);
        this.bookmarksService.createBookmark(target.parentId, title, url, index + 1);
      }

    } else if (this.clipboardType === 'cut') {

      // Move the existing bookmark inside of the folder, or just under a link entry
      if (target instanceof BookmarkFolderModel) {
        this.bookmarksService.moveBookmark(item.id, target.id, 0);
      } else {
        let parent = this.bookmarksService.getBookmark(target.parentId) as BookmarkFolderModel;
        let index = parent.children.indexOf(target.id);
        this.bookmarksService.moveBookmark(item.id, target.parentId, index + 1);
      }

      this.clearClipboard();

    }

  }

  public clearClipboard(): void {
    this.itemId = null;
    this.itemId$.next(null);
    this.clipboardType = null;
  }

}
