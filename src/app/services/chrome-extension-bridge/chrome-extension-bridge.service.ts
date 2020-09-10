/// <reference types="chrome"/>

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BookmarkBaseModel } from '../../models/bookmark-base.model';
import { BookmarkFolderModel } from '../../models/bookmark-folder.model';
import { BookmarkLinkModel } from '../../models/bookmark-link.model';

@Injectable({
  providedIn: 'root'
})
export class ChromeExtensionBridgeService {

  public onBookmarkCreated$ = new Subject<{model: BookmarkBaseModel}>();
  public onBookmarkRemoved$ = new Subject<{id: string, parentId: string}>();
  public onBookmarkChanged$ = new Subject<{id: string, title: string, url: string}>();
  public onBookmarkMoved$ = new Subject<{id: string, parentId: string, oldParentId: string, index: number, oldIndex: number}>();
  public onBookmarkChildrenReordered$ = new Subject<{id: string, childIds: string[]}>();

  constructor() { 

    // Listen to event changes in the bookmarks tree and broadcast Rxjs subjects when they fire
    chrome.bookmarks.onCreated.addListener((id, node) => this.handleBookmarkCreated(node));
    chrome.bookmarks.onRemoved.addListener((id, info) => this.onBookmarkRemoved$.next({id, parentId: info.parentId}));
    chrome.bookmarks.onChanged.addListener((id, info) => this.onBookmarkChanged$.next({id, title: info.title, url: info.url}));
    chrome.bookmarks.onMoved.addListener((id, info) => this.onBookmarkMoved$.next({id, ...info}));
    chrome.bookmarks.onChildrenReordered.addListener((id, info) => this.onBookmarkChildrenReordered$.next({id, childIds: info.childIds}));

  }

  public readBookmarksTree(): Observable<{bookmarks: BookmarkBaseModel[], topLevelIds: string[]}> {

    return new Observable<{bookmarks: BookmarkBaseModel[], topLevelIds: string[]}>(observer => {

      // Read the bookmarks tree
      chrome.bookmarks.getTree((tree: chrome.bookmarks.BookmarkTreeNode[]) => {

        const bookmarks: BookmarkBaseModel[] = [];
        const topLevelIds: string[] = [];

        tree.forEach(topLevelNode => {
          topLevelNode.children.forEach(managerNode => {

            // Store the top level nodes (manager nodes) as access-points into the tree
            topLevelIds.push(managerNode.id);

            // Iterate over the tree and store each child node
            walkTree(managerNode, (node) => {
              const model = nodeToModel(node);
              if (model.id === managerNode.id) {
                model.modifiable = false;
                (model as BookmarkFolderModel).isOpen = true;
              }

              bookmarks.push(model);
            });

          });
        });

        // Emit the information read from chrome and complete the observable
        observer.next({ bookmarks, topLevelIds });
        observer.complete();

      });

    });

  }

  public getChildrenIds(id: string): Observable<string[]> {

    return new Observable<string[]>(observer => {
      chrome.bookmarks.getChildren(id, (children) => {
        observer.next(children.map(x => x.id));
      });
    });

  }

  public createBookmark(parentId: string, title: string, url: string = null): void {
    if (url) {
      chrome.bookmarks.create({ parentId, title, url });
    } else {
      chrome.bookmarks.create({ parentId, title });
    }
  }

  public updateBookmark(id: string, updateInfo: Partial<{ title: string; url: string; }>): void {
    chrome.bookmarks.update(id, updateInfo);
  }

  public moveBookmark(id: string, parentId: string, index: number): void {
    chrome.bookmarks.move(id, { parentId, index });
  }

  public removeBookmark(id: string): void {
    chrome.bookmarks.remove(id);
  }

  public removeFolder(id: string): void {
    chrome.bookmarks.removeTree(id);
  }

  public openInCurrentTab(url: string): void {
    chrome.tabs.getSelected(null, function(openWindow) {
      chrome.tabs.update(openWindow.id, {active: true, url: String(url)});
    });
  }

  public openInNewTab(url: string): void {
    chrome.tabs.create({url: String(url), active: false});
  }

  public openInNewWindow(url: string): void {
    chrome.windows.create({url: String(url), incognito: false});
  }

  public openInNewIWindow(url: string): void {
    chrome.windows.create({url: String(url), incognito: true});
  }

  private handleBookmarkCreated(newNode: chrome.bookmarks.BookmarkTreeNode): void {

    if (newNode.url !== null && newNode.url !== undefined) {
      this.onBookmarkCreated$.next({ model: new BookmarkLinkModel(newNode) });
    } else {

      // This event may not have any child nodes for folders, force a full get here
      chrome.bookmarks.getSubTree(newNode.id, ([nodeNodeFull]) => {
        walkTree(nodeNodeFull, (childNode) => {
          const model = nodeToModel(childNode);
          this.onBookmarkCreated$.next({ model });
        });
      });

    }

  }

}

// Traverse bookmark tree nodes
function walkTree(baseNode: chrome.bookmarks.BookmarkTreeNode, callback: (node: chrome.bookmarks.BookmarkTreeNode) => void): void {
  callback(baseNode);
  if (baseNode.children) {
    baseNode.children.forEach((childNode) => {
      walkTree(childNode, callback);
    });
  }
}

// Converts a BookmarkTreeNode into this app's model
function nodeToModel(node: chrome.bookmarks.BookmarkTreeNode): BookmarkBaseModel {
  if (node.children) {
    return new BookmarkFolderModel(node);
  } else {
    return new BookmarkLinkModel(node);
  }
}
