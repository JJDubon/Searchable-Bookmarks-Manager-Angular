import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { ChromeExtensionBridgeService } from '../chrome-extension-bridge/chrome-extension-bridge.service';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {

  public initialized$ = new AsyncSubject<void>();

  private bookmarksMap: { [id: string]: BookmarkBaseModel };
  private topLevelNodes: string[];

  constructor(private chromeExtensionBridge: ChromeExtensionBridgeService) { 

    // Retrieve the bookmarks tree from the chrome extension api
    this.chromeExtensionBridge.readBookmarksTree().subscribe(({ bookmarks, topLevelNodes }) => {

      this.topLevelNodes = topLevelNodes;
      this.bookmarksMap = {};
      bookmarks.forEach(b => {
        this.bookmarksMap[b.id] = b;
      });

      this.initialized$.next();
      this.initialized$.complete();
      
    });

  }

  public getTopLevelNodes(): string[] {
    return this.topLevelNodes;
  }

  public getBookmark(id: string): BookmarkBaseModel {
    return this.bookmarksMap[id];
  }

}
