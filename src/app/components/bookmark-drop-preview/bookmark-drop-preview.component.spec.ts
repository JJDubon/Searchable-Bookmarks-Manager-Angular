import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { AllowUnsafePipe } from 'src/app/pipes/allow-unsafe.pipe';
import { ChromeExtensionBridgeService } from 'src/app/services/chrome-extension-bridge/chrome-extension-bridge.service';
import { DragService } from 'src/app/services/drag/drag.service';
import { testbookmarks } from 'src/app/tests/data/test-bookmarks';
import { chromeExtensionBridgeTestService } from 'src/app/tests/helpers/chrome-extension-bridge-test.service';
import { WindowToken } from 'src/window';
import { BookmarkBaseComponent } from '../bookmark-base/bookmark-base.component';

import { BookmarkDropPreviewComponent } from './bookmark-drop-preview.component';

fdescribe('BookmarkDropPreviewComponent', () => {
  
  let component: BookmarkDropPreviewComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<BookmarkDropPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkDropPreviewComponent, BookmarkBaseComponent, AllowUnsafePipe ],
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
    // Note: This call to "overrideComponent" fixes a node bug with OnPush change detection strategy and unit testing
    .overrideComponent(BookmarkBaseComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkDropPreviewComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the drag target', () => {
    
    let dragService = TestBed.inject(DragService);
    let bookmark = testbookmarks.find(x => x.id === "9") as BookmarkLinkModel;
    component.ngOnInit();
    dragService.dragTarget$.next(bookmark);

    fixture.detectChanges();
    expect(component.dragTarget).toBe(bookmark);

  });

  it('should render a folder', () => {
    
    let dragService = TestBed.inject(DragService);
    let bookmark = testbookmarks.find(x => x.id === "1") as BookmarkFolderModel;
    component.ngOnInit();
    dragService.dragTarget$.next(bookmark);

    fixture.detectChanges();
    expect(element.querySelector('app-bookmark-base')).toBeTruthy();

  });

  it('should render a bookmark', () => {
    
    let dragService = TestBed.inject(DragService);
    let bookmark = testbookmarks.find(x => x.id === "9") as BookmarkLinkModel;
    component.ngOnInit();
    dragService.dragTarget$.next(bookmark);

    fixture.detectChanges();
    expect(element.querySelector('app-bookmark-base')).toBeTruthy();

  });

});
