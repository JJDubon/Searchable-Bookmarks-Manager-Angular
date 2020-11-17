import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChromeExtensionBridgeService } from 'src/app/services/chrome-extension-bridge/chrome-extension-bridge.service';
import { chromeExtensionBridgeTestService } from 'src/app/tests/helpers/chrome-extension-bridge-test.service';
import { WindowToken } from 'src/window';

import { BookmarkLinkEditDialogComponent } from './bookmark-link-edit-dialog.component';

describe('BookmarkLinkEditDialogComponent', () => {
  let component: BookmarkLinkEditDialogComponent;
  let fixture: ComponentFixture<BookmarkLinkEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkLinkEditDialogComponent ],
      imports: [
        MatDialogModule
      ],
      providers: [ 
        {
          provide: WindowToken,
          useValue: window
        },
        { 
          provide: MAT_DIALOG_DATA, 
          useValue: {} 
        },
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: ChromeExtensionBridgeService,
          useValue: chromeExtensionBridgeTestService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkLinkEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
