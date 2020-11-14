import { of, Subject } from 'rxjs';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { ChromeExtensionBridgeService } from 'src/app/services/chrome-extension-bridge/chrome-extension-bridge.service';
import { testbookmarks } from '../data/test-bookmarks';

export const chromeExtensionBridgeTestService = {} as ChromeExtensionBridgeService;

Object.getOwnPropertyNames(ChromeExtensionBridgeService.prototype).forEach(prop => {
  if (prop !== 'constructor') {
    chromeExtensionBridgeTestService[prop] = () => {};
  }
});

chromeExtensionBridgeTestService.readBookmarksTree = function() {
  return of({
    topLevelIds: testbookmarks.filter(x => x.parentId === "0").map(x => x.id),
    bookmarks: testbookmarks as BookmarkBaseModel[]
  });
}

chromeExtensionBridgeTestService.getLocal = function(key: string) {
  return of({});
}

chromeExtensionBridgeTestService.storeLocal = function<T>(key: string, value: T) {
  return of();
}

chromeExtensionBridgeTestService.onBookmarkCreated$ = new Subject<{model: BookmarkBaseModel}>();
chromeExtensionBridgeTestService.onBookmarkRemoved$ = new Subject<{id: string, parentId: string}>();
chromeExtensionBridgeTestService.onBookmarkChanged$ = new Subject<{id: string, title: string, url: string}>();
chromeExtensionBridgeTestService.onBookmarkMoved$ = new Subject<{id: string, parentId: string, oldParentId: string, index: number, oldIndex: number}>();
chromeExtensionBridgeTestService.onBookmarkChildrenReordered$ = new Subject<{id: string, childIds: string[]}>();
