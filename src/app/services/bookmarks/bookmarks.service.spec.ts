import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { testbookmarks } from 'src/app/tests/data/test-bookmarks';
import { chromeExtensionBridgeTestService } from 'src/app/tests/helpers/chrome-extension-bridge-test.service';
import { ChromeExtensionBridgeService } from '../chrome-extension-bridge/chrome-extension-bridge.service';
import { BookmarksService } from './bookmarks.service';

describe('BookmarksService', () => {

  let service: BookmarksService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ChromeExtensionBridgeService,
          useValue: chromeExtensionBridgeTestService
        }
      ]
    });

    service = TestBed.inject(BookmarksService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize', (doneFn) => {
    service.initialized$.subscribe(() => {
      expect(service.getBookmark("1")).toBeTruthy();
      doneFn();
    });
  });

  it('should get a bookmark', () => {
    const bookmark = testbookmarks.filter(x => x.id === "1")[0];
    expect(JSON.stringify(bookmark)).toBe(JSON.stringify(service.getBookmark("1")));
  });

  it('should toggle a folder open and closed', () => {
    const folder = service.getBookmark("1") as BookmarkFolderModel;
    expect(folder.isOpen).toBeTrue();
    service.toggleFolderOpenOrClosed("1");
    expect(folder.isOpen).toBeFalse();
    service.toggleFolderOpenOrClosed("1");
    expect(folder.isOpen).toBeTrue();
  });

  it('should create a bookmark', () => {
    
    const cxService = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(cxService, 'createBookmark').and.callFake(() => {});
    
    service.createBookmark("1", "Fake Title");
    expect(cxService.createBookmark).toHaveBeenCalled();

  });

  it('should update a bookmark', () => {
    
    const cxService = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(cxService, 'updateBookmark').and.callFake(() => {});
    
    service.updateBookmark("1", { title: "Fake Title", url: "https://example.com" });
    expect(cxService.updateBookmark).toHaveBeenCalled();

  });

  it('should move a bookmark', () => {
    
    const cxService = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(cxService, 'moveBookmark').and.callFake(() => {});
    
    service.moveBookmark("99", "1", 0);
    expect(cxService.moveBookmark).toHaveBeenCalled();

  });

  it('should remove a bookmark', () => {
    
    const cxService = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(cxService, 'removeBookmark').and.callFake(() => {});
    
    service.removeBookmark("1");
    expect(cxService.removeBookmark).toHaveBeenCalled();

  });

  it('should remove a folder', () => {
    
    const cxService = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(cxService, 'removeFolder').and.callFake(() => {});
    
    service.removeFolder("1");
    expect(cxService.removeFolder).toHaveBeenCalled();

  });

  it('should run a search', () => {
    
    const cxService = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(cxService, 'search').and.callFake(() => {
      return of([]);
    });
    
    service.search("query");
    expect(cxService.search).toHaveBeenCalled();

  });

  it('should close a search', (doneFn) => {
    
    let initialSubscribe = true;
    const sub$ = service.topLevelIds$.subscribe((ids) => {
      if (initialSubscribe == true) {
        initialSubscribe = false;
      } else {
        expect(ids).toBeTruthy();
        sub$.unsubscribe();
        doneFn();
      }
    });
    
    service.closeSearch();

  });

  it('should open a bookmark in a current tab', () => {
    
    const bookmark = service.getBookmark("9") as BookmarkLinkModel;
    const cxService = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(cxService, 'openInCurrentTab').and.callFake(() => {
      return of([]);
    });
    
    service.openInCurrentTab(bookmark);
    expect(cxService.openInCurrentTab).toHaveBeenCalled();

  });

  it('should open a bookmark in a new tab', () => {
    
    const bookmark = service.getBookmark("9") as BookmarkLinkModel;
    const cxService = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(cxService, 'openInNewTab').and.callFake(() => {
      return of([]);
    });
    
    service.openInNewTab(bookmark);
    expect(cxService.openInNewTab).toHaveBeenCalled();

  });

  it('should open a bookmark in a new window', () => {
    
    const bookmark = service.getBookmark("9") as BookmarkLinkModel;
    const cxService = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(cxService, 'openInNewWindow').and.callFake(() => {
      return of([]);
    });
    
    service.openInNewWindow(bookmark);
    expect(cxService.openInNewWindow).toHaveBeenCalled();

  });

  it('should open a bookmark in a new incognito window', () => {
    
    const bookmark = service.getBookmark("9") as BookmarkLinkModel;
    const cxService = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(cxService, 'openInNewIWindow').and.callFake(() => {
      return of([]);
    });
    
    service.openInNewIWindow(bookmark);
    expect(cxService.openInNewIWindow).toHaveBeenCalled();

  });

  it('should determine if one bookmark is the child of another bookmark', () => {
    expect(service.idRepresentsChildOf("9", "1")).toBeTrue();
    expect(service.idRepresentsChildOf("1", "9")).toBeFalse();
  });

});
