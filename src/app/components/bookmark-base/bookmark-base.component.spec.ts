import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { AllowUnsafePipe } from 'src/app/pipes/allow-unsafe.pipe';
import { ChromeExtensionBridgeService } from 'src/app/services/chrome-extension-bridge/chrome-extension-bridge.service';
import { DragService } from 'src/app/services/drag/drag.service';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { testbookmarks } from 'src/app/tests/data/test-bookmarks';
import { chromeExtensionBridgeTestService } from 'src/app/tests/helpers/chrome-extension-bridge-test.service';
import { WindowToken } from 'src/window';
import { BookmarkBaseComponent } from './bookmark-base.component';

describe('BookmarkBaseComponent', () => {

  let component: BookmarkBaseComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<BookmarkBaseComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ BookmarkBaseComponent, AllowUnsafePipe ],
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
    .overrideComponent(BookmarkBaseComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();

  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(BookmarkBaseComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    let bookmark = testbookmarks.find(x => x.id === "9") as BookmarkLinkModel;
    component.id = bookmark.id;
    component.title = bookmark.title;
    component.tooltip = bookmark.url;
    component.icon = bookmark.url;

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render expected bookmark information', () => {

    let bookmark = testbookmarks.find(x => x.id === "9") as BookmarkLinkModel;

    expect((element.querySelector('.bookmark') as HTMLDivElement).title)
      .toBe(bookmark.url);

    expect((element.querySelector('.bookmark-title') as HTMLElement).textContent)
      .toBe(bookmark.title);

    expect((element.querySelector('.bookmark-icon') as HTMLImageElement).src)
      .toBe(bookmark.url);

  });

  it('should set the active drag target', () => {

    let bookmark = testbookmarks.find(x => x.id === "9") as BookmarkLinkModel;    
    let dragService = TestBed.inject(DragService);
    dragService.dragTarget$.next(bookmark);
    expect(component.dragTarget).toBe(bookmark);

  });

  it('should determine if it is the active keyboard target', () => {

    let keyboardService = TestBed.inject(KeyboardService);
    keyboardService.activeId$.next("9");
    expect(component.activeKeyboardTarget).toBeTrue();

    
  });

  it('should attach drag listeners', () => {

    let dragService = TestBed.inject(DragService);
    spyOn(dragService, 'attachListeners').and.callFake(() => {
      return of().subscribe();
    });

    component.ngAfterViewInit();
    expect(dragService.attachListeners).toHaveBeenCalled();

  });

});
