import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WindowToken } from 'src/window';
import { BookmarkFolderEditDialogComponent } from './bookmark-folder-edit-dialog.component';

describe('BookmarkFolderEditDialogComponent', () => {
  let component: BookmarkFolderEditDialogComponent;
  let fixture: ComponentFixture<BookmarkFolderEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkFolderEditDialogComponent ],
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
    fixture = TestBed.createComponent(BookmarkFolderEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
