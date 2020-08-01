import { Injectable } from '@angular/core';
import { AsyncSubject, Subject } from 'rxjs';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { ChromeExtensionBridgeService } from '../chrome-extension-bridge/chrome-extension-bridge.service';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {

  public initialized$ = new AsyncSubject<void>();
  public bookmarkChanged$ = new Subject<BookmarkBaseModel>();

  private bookmarksMap: { [id: string]: BookmarkBaseModel };
  private topLevelIds: string[];

  constructor(private chromeExtensionBridge: ChromeExtensionBridgeService) { 

    // When the tree has been read, listen to the bookmark api's change events
    this.initialized$.subscribe(() => {
      this.createListeners();
    });

    // Retrieve the bookmarks tree from the chrome extension api
    this.chromeExtensionBridge.readBookmarksTree().subscribe(({ bookmarks, topLevelIds }) => {

      // Populate the service's member
      this.topLevelIds = topLevelIds;
      this.bookmarksMap = {};
      bookmarks.forEach(b => {
        this.bookmarksMap[b.id] = b;
      });

      // Add in a dummy node for accessing the bookmarks manager
      this.topLevelIds.push('__bookmark-manager');
      this.bookmarksMap['__bookmark-manager'] = new BookmarkLinkModel({
        id: '__bookmark-manager',
        title: 'Bookmarks Manager',
        unmodifiable: true
      });

      // Mark this service as initialized
      this.initialized$.next();
      this.initialized$.complete();
      
    });

  }

  public getTopLevelIds(): string[] {
    return this.topLevelIds;
  }

  public getBookmark(id: string): BookmarkBaseModel {
    return this.bookmarksMap[id];
  }

  private createListeners(): void {

    // Add a bookmark to the map when a bookmark is created
    this.chromeExtensionBridge.onBookmarkCreated$.subscribe(({model}) => {  

      // Add the bookmark to the map
      this.bookmarksMap[model.id] = model
      
      // Fetch the updated order of the new bookmark's parent
      const parent = this.bookmarksMap[model.parentId] as BookmarkFolderModel;
      if (parent) {
        this.chromeExtensionBridge.getChildrenIds(model.parentId).subscribe(ids => {
          parent.children = ids;
          this.bookmarkChanged$.next(parent);
        });
      }

    });

    // Remove the bookmark when one has been deleted
    this.chromeExtensionBridge.onBookmarkRemoved$.subscribe(({id, parentId}) => {

      // Remove the bookmark from the map
      delete this.bookmarksMap[id];

      // Remove the bookmark from its parent's "children" member
      const parent = this.bookmarksMap[parentId] as BookmarkFolderModel;
      if (parent) {
        parent.children = parent.children.filter(x => x !== id);
        this.bookmarkChanged$.next(parent);
      }

    });

    // Update the "title" and "url" field in response to the api's change event
    this.chromeExtensionBridge.onBookmarkChanged$.subscribe(({id, title, url}) => {

      const bookmark = this.bookmarksMap[id];
      if (bookmark instanceof BookmarkLinkModel) {
        bookmark.title = title;
        bookmark.url = url;
      } else {
        bookmark.title = title;
      }

      this.bookmarkChanged$.next(bookmark);

    });

    // Update the order of a bookmarks children when moved
    this.chromeExtensionBridge.onBookmarkMoved$.subscribe(({id, parentId, oldParentId, index, oldIndex}) => {

      const parent = this.bookmarksMap[parentId] as BookmarkFolderModel;
      if (parent) {
        this.chromeExtensionBridge.getChildrenIds(parentId).subscribe(ids => {
          parent.children = ids;
          this.bookmarkChanged$.next(parent);
        });
      }

      const oldParent = this.bookmarksMap[oldParentId] as BookmarkFolderModel;
      if (oldParent) {
        this.chromeExtensionBridge.getChildrenIds(oldParentId).subscribe(ids => {
          oldParent.children = ids;
          this.bookmarkChanged$.next(oldParent);
        });
      }

    });

    // Updates a bookmark's children when reordered
    this.chromeExtensionBridge.onBookmarkChildrenReordered$.subscribe(({id, childIds}) => {

      const bookmark = this.bookmarksMap[id] as BookmarkFolderModel;
      if (bookmark) {
        bookmark.children = childIds;
        this.bookmarkChanged$.next(bookmark);
      }

    });
    
  }

}
