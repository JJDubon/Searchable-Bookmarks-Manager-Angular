import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkLinkEditDialogComponent } from './bookmark-link-edit-dialog.component';

describe('BookmarkLinkEditDialogComponent', () => {
  let component: BookmarkLinkEditDialogComponent;
  let fixture: ComponentFixture<BookmarkLinkEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkLinkEditDialogComponent ]
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
