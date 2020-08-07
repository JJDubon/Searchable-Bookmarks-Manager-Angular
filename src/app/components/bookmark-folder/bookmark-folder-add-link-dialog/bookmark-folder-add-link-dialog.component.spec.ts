import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkFolderAddLinkDialogComponent } from './bookmark-folder-add-link-dialog.component';

describe('BookmarkFolderAddLinkDialogComponent', () => {
  let component: BookmarkFolderAddLinkDialogComponent;
  let fixture: ComponentFixture<BookmarkFolderAddLinkDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkFolderAddLinkDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkFolderAddLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
