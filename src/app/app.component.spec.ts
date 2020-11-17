import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WindowToken } from 'src/window';
import { AppComponent } from './app.component';
import { BookmarkBaseComponent } from './components/bookmark-base/bookmark-base.component';
import { BookmarkDropPreviewComponent } from './components/bookmark-drop-preview/bookmark-drop-preview.component';
import { BookmarkFolderComponent } from './components/bookmark-folder/bookmark-folder.component';
import { BookmarkLinkComponent } from './components/bookmark-link/bookmark-link.component';
import { BookmarkListComponent } from './components/bookmark-list/bookmark-list.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { AllowUnsafePipe } from './pipes/allow-unsafe.pipe';
import { ChromeExtensionBridgeService } from './services/chrome-extension-bridge/chrome-extension-bridge.service';
import { chromeExtensionBridgeTestService } from './tests/helpers/chrome-extension-bridge-test.service';

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AppComponent, 
        SearchFieldComponent,
        BookmarkLinkComponent,
        BookmarkFolderComponent, 
        BookmarkListComponent,
        BookmarkDropPreviewComponent, 
        BookmarkBaseComponent, 
        AllowUnsafePipe,
        BookmarkLinkComponent
      ],
      imports: [
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatSelectModule,
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
    .overrideComponent(AppComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
