import { Injectable } from '@angular/core';
import { AsyncSubject, Subject } from 'rxjs';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
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

    });

    // Retrieve the bookmarks tree from the chrome extension api
    this.chromeExtensionBridge.readBookmarksTree().subscribe(({ bookmarks, topLevelIds }) => {

      this.topLevelIds = topLevelIds;
      this.bookmarksMap = {};
      bookmarks.forEach(b => {
        this.bookmarksMap[b.id] = b;
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

}
