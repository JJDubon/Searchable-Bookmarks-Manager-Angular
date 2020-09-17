import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { testbookmarks } from 'src/app/tests/data/test-bookmarks';
import { bookmarksTestService } from 'src/app/tests/helpers/bookmarks-test.service';
import { chromeExtensionBridgeTestService } from 'src/app/tests/helpers/chrome-extension-bridge-test.service';
import { MockDataTransfer } from 'src/app/tests/helpers/mock-data-transfer';
import { MockElementRef } from 'src/app/tests/helpers/mock-element-ref';
import { WindowToken } from 'src/window';
import { ChromeExtensionBridgeService } from '../chrome-extension-bridge/chrome-extension-bridge.service';
import { DragService } from './drag.service';

describe('DragService', () => {

  let service: DragService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: WindowToken,
          useValue: { requestAnimationFrame: () => {} }
        },
        {
          provide: DOCUMENT,
          useValue: { querySelector: () => {} }
        },
        {
          provide: ChromeExtensionBridgeService,
          useValue: chromeExtensionBridgeTestService
        },
        {
          provide: BookmarksService,
          useValue: bookmarksTestService
        }
      ]
    });
    service = TestBed.inject(DragService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should drag by default', async () => {

    const fakeRef = new MockElementRef();
    const fakeEvent = new DragEvent('dragstart', { dataTransfer: new MockDataTransfer() });
    spyOn(fakeEvent, 'preventDefault');

    const bookmarksService = TestBed.inject(BookmarksService);
    const fakeBookmark = testbookmarks[0] as BookmarkBaseModel;
    fakeBookmark.modifiable = true;
    spyOn(bookmarksService, 'getBookmark').and.returnValue(fakeBookmark);

    service.attachListeners('1', fakeRef);

    fakeRef.nativeElement.dispatchEvent(fakeEvent)
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(fakeEvent.preventDefault).not.toHaveBeenCalled();

  });

  it('should not drag after disableDragging is called', async () => {

    const fakeRef = new MockElementRef();
    const fakeEvent = new DragEvent('dragstart', { dataTransfer: new MockDataTransfer() });
    spyOn(fakeEvent, 'preventDefault');

    const bookmarksService = TestBed.inject(BookmarksService);
    const fakeBookmark = testbookmarks[0] as BookmarkBaseModel;
    fakeBookmark.modifiable = true;
    spyOn(bookmarksService, 'getBookmark').and.returnValue(fakeBookmark);

    service.disableDragging();
    service.attachListeners('1', fakeRef);

    fakeRef.nativeElement.dispatchEvent(fakeEvent)
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(fakeEvent.preventDefault).toHaveBeenCalled();

  });

  it('should not drag after enableDragging is called', async () => {

    const fakeRef = new MockElementRef();
    const fakeEvent = new DragEvent('dragstart', { dataTransfer: new MockDataTransfer() });
    spyOn(fakeEvent, 'preventDefault');

    const bookmarksService = TestBed.inject(BookmarksService);
    const fakeBookmark = testbookmarks[0] as BookmarkBaseModel;
    fakeBookmark.modifiable = true;
    spyOn(bookmarksService, 'getBookmark').and.returnValue(fakeBookmark);

    service.disableDragging();
    service.enableDragging();
    service.attachListeners('1', fakeRef);

    fakeRef.nativeElement.dispatchEvent(fakeEvent)
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(fakeEvent.preventDefault).not.toHaveBeenCalled();

  });

  it('should not drag unmodifiable bookmarks', async () => {

    const fakeRef = new MockElementRef();
    const fakeEvent = new DragEvent('dragstart', { dataTransfer: new MockDataTransfer() });
    spyOn(fakeEvent, 'preventDefault');

    const bookmarksService = TestBed.inject(BookmarksService);
    const fakeBookmark = testbookmarks[0] as BookmarkBaseModel;
    fakeBookmark.modifiable = false;
    spyOn(bookmarksService, 'getBookmark').and.returnValue(fakeBookmark);

    service.attachListeners('1', fakeRef);

    fakeRef.nativeElement.dispatchEvent(fakeEvent)
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(fakeEvent.preventDefault).toHaveBeenCalled();

  });

});
