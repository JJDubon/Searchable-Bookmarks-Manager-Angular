import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WindowToken } from 'src/window';
import { BookmarkLinkDeleteDialogComponent } from './bookmark-link-delete-dialog.component';

describe('BookmarkLinkDeleteDialogComponent', () => {
  let component: BookmarkLinkDeleteDialogComponent;
  let fixture: ComponentFixture<BookmarkLinkDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkLinkDeleteDialogComponent ],
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
    fixture = TestBed.createComponent(BookmarkLinkDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
