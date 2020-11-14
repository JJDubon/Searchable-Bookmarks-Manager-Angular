import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { testbookmarks } from 'src/app/tests/data/test-bookmarks';
import { bookmarksTestService } from 'src/app/tests/helpers/bookmarks-test.service';
import { chromeExtensionBridgeTestService } from 'src/app/tests/helpers/chrome-extension-bridge-test.service';
import { WindowToken } from 'src/window';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { ChromeExtensionBridgeService } from '../chrome-extension-bridge/chrome-extension-bridge.service';
import { KeyboardService } from './keyboard.service';

describe('KeyboardService', () => {

  let service: KeyboardService;

  beforeEach(() => {

    spyOn(chromeExtensionBridgeTestService, 'readBookmarksTree').and.returnValue(of({
      topLevelIds: testbookmarks.filter(x => x.parentId === "0").map(x => x.id),
      bookmarks: testbookmarks as BookmarkBaseModel[]
    }));

    spyOn(chromeExtensionBridgeTestService, 'getLocal').and.returnValue(of({}));
    spyOn(chromeExtensionBridgeTestService, 'storeLocal').and.returnValue(of());
    chromeExtensionBridgeTestService.onBookmarkCreated$ = new Subject<{model: BookmarkBaseModel}>();
    chromeExtensionBridgeTestService.onBookmarkRemoved$ = new Subject<{id: string, parentId: string}>();
    chromeExtensionBridgeTestService.onBookmarkChanged$ = new Subject<{id: string, title: string, url: string}>();
    chromeExtensionBridgeTestService.onBookmarkMoved$ = new Subject<{id: string, parentId: string, oldParentId: string, index: number, oldIndex: number}>();
    chromeExtensionBridgeTestService.onBookmarkChildrenReordered$ = new Subject<{id: string, childIds: string[]}>();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: WindowToken,
          useValue: { requestAnimationFrame: () => {} }
        },
        {
          provide: DOCUMENT,
          useValue: document
        },
        {
          provide: ChromeExtensionBridgeService,
          useValue: chromeExtensionBridgeTestService
        }
      ]
    });

    service = TestBed.inject(KeyboardService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should pull out the top bookmark when moving "up" with no initialization', (doneFn) => {

    var sub = service.activeId$.subscribe((id: string) => {
      if (id) {
        expect(id).toBe("__bookmark-manager");
        doneFn();
        sub.unsubscribe();
      }
    });

    document.dispatchEvent(new MouseEvent('mousemove'));
    
    service.init();

    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowUp'
    }));

  });

  it('should pull out the bottom bookmark when moving "down" with no initialization', (doneFn) => {

    var sub = service.activeId$.subscribe((id: string) => {
      if (id) {
        expect(id).toBe("1");
        doneFn();
        sub.unsubscribe();
      }
    });

    document.dispatchEvent(new MouseEvent('mousemove'));
    
    service.init();

    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowDown'
    }));

  });

  it('should be able to toggler a folder', () => {

    let bookmarkService = TestBed.inject(BookmarksService);
    spyOn(bookmarkService, 'toggleFolderOpenOrClosed').and.callFake(() => {});

    document.dispatchEvent(new MouseEvent('mousemove'));
    
    service.init();

    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowDown'
    }));

    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter'
    }));

    expect(bookmarkService.toggleFolderOpenOrClosed).toHaveBeenCalled();

  });

});
