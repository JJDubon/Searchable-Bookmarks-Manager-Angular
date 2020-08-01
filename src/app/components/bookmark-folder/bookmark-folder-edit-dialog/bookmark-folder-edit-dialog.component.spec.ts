import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkFolderEditDialogComponent } from './bookmark-folder-edit-dialog.component';

describe('BookmarkFolderEditDialogComponent', () => {
  let component: BookmarkFolderEditDialogComponent;
  let fixture: ComponentFixture<BookmarkFolderEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkFolderEditDialogComponent ]
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
