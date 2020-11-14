import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { chromeExtensionBridgeTestService } from 'src/app/tests/helpers/chrome-extension-bridge-test.service';
import { WindowToken } from 'src/window';
import { BookmarksService } from '../bookmarks/bookmarks.service';
import { ChromeExtensionBridgeService } from '../chrome-extension-bridge/chrome-extension-bridge.service';
import { KeyboardService } from './keyboard.service';

describe('KeyboardService', () => {

  let service: KeyboardService;

  beforeEach(() => {

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
