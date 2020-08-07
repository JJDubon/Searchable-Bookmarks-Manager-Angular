import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkFolderAddFolderDialogComponent } from './bookmark-folder-add-folder-dialog.component';

describe('BookmarkFolderAddFolderDialogComponent', () => {
  let component: BookmarkFolderAddFolderDialogComponent;
  let fixture: ComponentFixture<BookmarkFolderAddFolderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkFolderAddFolderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkFolderAddFolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
