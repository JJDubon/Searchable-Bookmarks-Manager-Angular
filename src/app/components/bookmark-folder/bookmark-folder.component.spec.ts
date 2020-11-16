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
import { BookmarkLinkComponent } from '../bookmark-link/bookmark-link.component';
import { BookmarkListComponent } from '../bookmark-list/bookmark-list.component';
import { BookmarkFolderComponent } from './bookmark-folder.component';

describe('BookmarkFolderComponent', () => {
  
  let component: BookmarkFolderComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<BookmarkFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
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
    // Note: This call to "overrideComponent" fixes a node bug with OnPush change detection strategy and unit testing
    .overrideComponent(BookmarkFolderComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(BookmarkFolderComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    component.bookmarkId = "1";

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize template', () => {
    expect(element.querySelector('app-bookmark-base')).toBeTruthy();
    expect(element.querySelector('app-bookmark-list')).toBeTruthy();
  });

  it('should expand and collapse', () => {
    expect(component.state).toBe('open');
    component.toggleState();
    expect(component.state).toBe('closed');
    component.toggleState();
    expect(component.state).toBe('open');
  });

});
