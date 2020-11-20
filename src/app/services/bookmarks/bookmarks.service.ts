import { Injectable } from '@angular/core';
import { AsyncSubject, BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { environment } from 'src/environments/environment';
import { ChromeExtensionBridgeService } from '../chrome-extension-bridge/chrome-extension-bridge.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {

  public initialized$ = new AsyncSubject<void>();
  public bookmarkChanged$ = new Subject<BookmarkBaseModel>();
  public topLevelIds$ = new BehaviorSubject<string[]>([]);

  private bookmarksMap: { [id: string]: BookmarkBaseModel };
  private managerNodeIds: string[];
  private searchResultIds: string[];
  private searchQuerySubscription: Subscription;

  constructor(private chromeExtensionBridge: ChromeExtensionBridgeService, private storageService: StorageService) { 

    // When the tree has been read, listen to the bookmark api's change events
    this.initialized$.subscribe(() => {
      this.createListeners();
    });

    // Retrieve the bookmarks tree and locally stored data from the chrome extension api
    combineLatest([this.chromeExtensionBridge.readBookmarksTree(), this.storageService.getStoredData()]).subscribe(results => {

      const bookmarks = results[0].bookmarks;
      const topLevelIds = results[0].topLevelIds;
      const storedData = results[1] ?? {};

      if (!environment.production) {
        console.info("Stored data read in by this extension", storedData);
      }

      // Populate the service's member
      this.managerNodeIds = topLevelIds;
      this.bookmarksMap = {};
      bookmarks.forEach(b => {

        // Store the bookmark in the map
        this.bookmarksMap[b.id] = b;

        // Set the default open/close state
        const isOpenByDefault = storedData[this.storageService.getOpenByDefaultKey(b.id)];
        if (isOpenByDefault) {
          (this.bookmarksMap[b.id] as BookmarkFolderModel).isOpen = true;
        }

        // If this is the first time running this extension or a new manager node has been added, mark manager nodes as open by default
        if (this.managerNodeIds.find(x => x === b.id) && isOpenByDefault == null) {
          (this.bookmarksMap[b.id] as BookmarkFolderModel).isOpen = true;
          this.storageService.storeOpenByDefault(b.id).subscribe();
        }

      });

      // Add in a dummy node for accessing the bookmarks manager
      this.managerNodeIds.push('__bookmark-manager');
      this.bookmarksMap['__bookmark-manager'] = new BookmarkLinkModel({
        id: '__bookmark-manager',
        title: 'Bookmarks Manager',
        url: 'chrome://bookmarks/',
        unmodifiable: true
      });

      // Mark this service as initialized
      this.initialized$.next();
      this.initialized$.complete();

      // Update top level ids
      this.topLevelIds$.next(this.managerNodeIds);

    });

  }

  public getBookmark(id: string): BookmarkBaseModel {
    return this.bookmarksMap[id];
  }

  public toggleFolderOpenOrClosed(id: string): void {
    const folder = this.bookmarksMap[id] as BookmarkFolderModel;
    if (folder) {
      folder.isOpen = !folder.isOpen;
      this.bookmarkChanged$.next(folder);
    }
  }

  public createBookmark(parentId: string, title: string, url: string = null, index: number = 0): void {
    this.chromeExtensionBridge.createBookmark(parentId, title, url, index);
  }

  public updateBookmark(id: string, updateInfo: Partial<{title: string, url: string}>): void {
    this.chromeExtensionBridge.updateBookmark(id, updateInfo);
  }

  public moveBookmark(id: string, parentId: string, index: number): void {
    this.chromeExtensionBridge.moveBookmark(id, parentId, index);
  }

  public removeBookmark(id: string): void {
    this.chromeExtensionBridge.removeBookmark(id);
  }

  public removeFolder(id: string): void {
    this.chromeExtensionBridge.removeFolder(id);
  }

  public search(query: string): void {

    // If a query is already running, forget it
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
      this.searchQuerySubscription = null;
    }

    // Run the search
    this.searchQuerySubscription = this.chromeExtensionBridge.search(query).subscribe(topLevelIds => {

      this.searchResultIds = topLevelIds;
      this.topLevelIds$.next(this.searchResultIds);
      
    });

  }

  public closeSearch(): void {

    // If a query is already running, forget it
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
      this.searchQuerySubscription = null;
    }

    this.searchResultIds = null;
    this.topLevelIds$.next(this.managerNodeIds);
    
  }

  public openInCurrentTab(link: BookmarkLinkModel): void {
    this.chromeExtensionBridge.openInCurrentTab(link.url);
  }

  public openInNewTab(link: BookmarkLinkModel): void {
    this.chromeExtensionBridge.openInNewTab(link.url);
  }

  public openInNewWindow(link: BookmarkLinkModel): void {
    this.chromeExtensionBridge.openInNewWindow(link.url);
  }

  public openInNewIWindow(link: BookmarkLinkModel): void {
    this.chromeExtensionBridge.openInNewIWindow(link.url);
  }

  public idRepresentsChildOf(id: string, parentId: string): boolean {

    // Return false if the ids match as a node is not a child of itself
    if (id === parentId) {
      return false;
    }

    // Iterate over parent nodes and return true if the parent node matches the given id
    let target = id;
    do {

      let bookmark = this.bookmarksMap[target];
      if (bookmark == null) {
        return false;
      } else if (bookmark.id === parentId) {
        return true;
      } else {
        target = bookmark.parentId;
      }

    } while (target != null);

    // If this node is reached, return false
    return false;

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

      this.managerNodeIds = this.managerNodeIds.filter(x => x !== id);
      this.searchResultIds = this.searchResultIds.filter(x => x !== id);
      if (this.searchQuerySubscription) {
        this.topLevelIds$.next(this.searchResultIds);
      } else {
        this.topLevelIds$.next(this.managerNodeIds);
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

      const target = this.bookmarksMap[id];
      if (target) {
        target.parentId = parentId;
      }

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

  public cleanUrl(url: string): string {

    if (url === null) {
      return '';
    }

    const hasValidHttpOrHttpsHeader = url.indexOf("http://") !== -1 || url.indexOf("https://")  !== -1;
    if (!hasValidHttpOrHttpsHeader) {
      url = `http://${url}`;
    }

    return url;

  }

}
