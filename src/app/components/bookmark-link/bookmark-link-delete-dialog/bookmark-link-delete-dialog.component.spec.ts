import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkLinkDeleteDialogComponent } from './bookmark-link-delete-dialog.component';

describe('BookmarkLinkDeleteDialogComponent', () => {
  let component: BookmarkLinkDeleteDialogComponent;
  let fixture: ComponentFixture<BookmarkLinkDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkLinkDeleteDialogComponent ]
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
