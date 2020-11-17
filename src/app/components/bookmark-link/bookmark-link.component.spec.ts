import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AllowUnsafePipe } from 'src/app/pipes/allow-unsafe.pipe';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { ChromeExtensionBridgeService } from 'src/app/services/chrome-extension-bridge/chrome-extension-bridge.service';
import { chromeExtensionBridgeTestService } from 'src/app/tests/helpers/chrome-extension-bridge-test.service';
import { WindowToken } from 'src/window';
import { BookmarkBaseComponent } from '../bookmark-base/bookmark-base.component';

import { BookmarkLinkComponent } from './bookmark-link.component';

describe('BookmarkLinkComponent', () => {

  let component: BookmarkLinkComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<BookmarkLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkLinkComponent, BookmarkBaseComponent, AllowUnsafePipe ],
      imports: [
        MatDialogModule
      ],
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
    })
    // Note: This call to "overrideComponent" fixes a known bug with OnPush change detection strategy and unit testing
    .overrideComponent(BookmarkLinkComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(BookmarkLinkComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    component.bookmarkId = "9";

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize template', () => {
    expect(element.querySelector('app-bookmark-base')).toBeTruthy();
  });

  it('should open in the current tab', () => {

    let bookmarkService = TestBed.inject(BookmarksService);
    spyOn(bookmarkService, 'openInCurrentTab');

    component.openBookmark(new MouseEvent('click', { ctrlKey: false }));

    expect(bookmarkService.openInCurrentTab).toHaveBeenCalled();

  });

  it('should open in the new tab on left click', () => {

    let bookmarkService = TestBed.inject(BookmarksService);
    spyOn(bookmarkService, 'openInNewTab');

    component.openBookmark(new MouseEvent('click', { button: 1, ctrlKey: true }));

    expect(bookmarkService.openInNewTab).toHaveBeenCalled();

  });

  it('should open in the new tab on middle click', () => {

    let bookmarkService = TestBed.inject(BookmarksService);
    spyOn(bookmarkService, 'openInNewTab');

    component.openIfMiddleClick(new MouseEvent('click', { button: 2 }));

    expect(bookmarkService.openInNewTab).toHaveBeenCalled();
    
  });

});
