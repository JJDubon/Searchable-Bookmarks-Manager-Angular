import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkFolderDeleteDialogComponent } from './bookmark-folder-delete-dialog.component';

describe('BookmarkFolderDeleteDialogComponent', () => {
  let component: BookmarkFolderDeleteDialogComponent;
  let fixture: ComponentFixture<BookmarkFolderDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkFolderDeleteDialogComponent ]
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
