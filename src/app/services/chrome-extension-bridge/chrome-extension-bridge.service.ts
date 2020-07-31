/// <reference types="chrome"/>

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookmarkBaseModel } from '../../models/bookmark-base.model';
import { BookmarkFolderModel } from '../../models/bookmark-folder.model';
import { BookmarkLinkModel } from '../../models/bookmark-link.model';

@Injectable({
  providedIn: 'root'
})
export class ChromeExtensionBridgeService {

  constructor() { }

  public readBookmarksTree(): Observable<{bookmarks: BookmarkBaseModel[], topLevelIds: string[]}> {

    return new Observable<{bookmarks: BookmarkBaseModel[], topLevelIds: string[]}>(observer => {

      // Read the bookmarks tree
      chrome.bookmarks.getTree((tree: chrome.bookmarks.BookmarkTreeNode[]) => {

        const bookmarks: BookmarkBaseModel[] = [];
        const topLevelIds: string[] = [];

        tree.forEach(topLevelNode => {
          topLevelNode.children.forEach(managerNode => {

            // Convert the node to a model
            const managerModel = new BookmarkFolderModel(managerNode);
            managerModel.modifiable = false;

            // Store the top level nodes (manager nodes) as access-points into the tree
            topLevelIds.push(managerModel.id);

            // Iterate over the tree and store each child node
            walkTree(managerNode, (node) => {
              const model = nodeToModel(node);
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
