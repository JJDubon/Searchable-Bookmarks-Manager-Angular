import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AllowUnsafePipe } from 'src/app/pipes/allow-unsafe.pipe';
import { ChromeExtensionBridgeService } from 'src/app/services/chrome-extension-bridge/chrome-extension-bridge.service';
import { chromeExtensionBridgeTestService } from 'src/app/tests/helpers/chrome-extension-bridge-test.service';
import { WindowToken } from 'src/window';
import { BookmarkBaseComponent } from '../bookmark-base/bookmark-base.component';
import { BookmarkDropPreviewComponent } from '../bookmark-drop-preview/bookmark-drop-preview.component';
import { BookmarkFolderComponent } from '../bookmark-folder/bookmark-folder.component';
import { BookmarkLinkComponent } from '../bookmark-link/bookmark-link.component';
import { BookmarkListComponent } from './bookmark-list.component';

describe('BookmarkListComponent', () => {
  
  let component: BookmarkListComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<BookmarkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        BookmarkLinkComponent,
        BookmarkFolderComponent, 
        BookmarkListComponent,
        BookmarkDropPreviewComponent, 
        BookmarkBaseComponent, 
        AllowUnsafePipe,
        BookmarkLinkComponent
      ],
      imports: [
        MatDialogModule,
        NoopAnimationsModule
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
    .overrideComponent(BookmarkListComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(BookmarkListComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    component.bookmarkIds = ["9", "5", "7", "8"]

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list bookmarks', () => {

    component.loadBookmarks();
    fixture.detectChanges();
    
    const ids = new Set<string>(component.bookmarks.map(x => x.id));
    expect(ids.has("9")).toBeTrue();
    expect(ids.has("5")).toBeTrue();
    expect(ids.has("7")).toBeTrue();
    expect(ids.has("8")).toBeTrue();

  });

});
