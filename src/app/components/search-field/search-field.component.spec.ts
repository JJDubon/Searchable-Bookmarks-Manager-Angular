import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { ChromeExtensionBridgeService } from 'src/app/services/chrome-extension-bridge/chrome-extension-bridge.service';
import { DragService } from 'src/app/services/drag/drag.service';
import { chromeExtensionBridgeTestService } from 'src/app/tests/helpers/chrome-extension-bridge-test.service';
import { WindowToken } from 'src/window';
import { SearchFieldComponent } from './search-field.component';

describe('SearchFieldComponent', () => {

  let component: SearchFieldComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<SearchFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFieldComponent ],
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
    .overrideComponent(SearchFieldComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFieldComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run a search when the input changes', () => {
    
    const bookmarkSearch = TestBed.inject(BookmarksService);
    const dragService = TestBed.inject(DragService);
    spyOn(dragService, 'enableDragging').and.callFake(() => { });
    spyOn(dragService, 'disableDragging').and.callFake(() => { });
    spyOn(bookmarkSearch, 'search').and.callFake(() => { });
    spyOn(bookmarkSearch, 'closeSearch').and.callFake(() => { });

    component.onSearchTextChange('search');
    expect(bookmarkSearch.search).toHaveBeenCalled();

  });

  it('should remove search text on close', () => {
    
    const bookmarkSearch = TestBed.inject(BookmarksService);
    const dragService = TestBed.inject(DragService);
    spyOn(dragService, 'enableDragging').and.callFake(() => { });
    spyOn(dragService, 'disableDragging').and.callFake(() => { });
    spyOn(bookmarkSearch, 'search').and.callFake(() => { });
    spyOn(bookmarkSearch, 'closeSearch').and.callFake(() => { });

    component.onSearchTextChange('search');
    expect(bookmarkSearch.search).toHaveBeenCalled();

    component.onSearchTextChange('');
    expect(bookmarkSearch.closeSearch).toHaveBeenCalled();

  });

  it('should be able to disable and enable dragging', () => {
    
    const bookmarkSearch = TestBed.inject(BookmarksService);
    const dragService = TestBed.inject(DragService);
    spyOn(dragService, 'enableDragging').and.callFake(() => { });
    spyOn(dragService, 'disableDragging').and.callFake(() => { });
    spyOn(bookmarkSearch, 'search').and.callFake(() => { });
    spyOn(bookmarkSearch, 'closeSearch').and.callFake(() => { });

    component.onSearchTextChange('search');
    expect(dragService.disableDragging).toHaveBeenCalled();

    component.onSearchTextChange('');
    expect(dragService.enableDragging).toHaveBeenCalled();
    
  });

});
