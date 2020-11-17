import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WindowToken } from 'src/window';
import { BookmarkFolderDeleteDialogComponent } from './bookmark-folder-delete-dialog.component';

describe('BookmarkFolderDeleteDialogComponent', () => {
  let component: BookmarkFolderDeleteDialogComponent;
  let fixture: ComponentFixture<BookmarkFolderDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkFolderDeleteDialogComponent ],
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
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkFolderDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
