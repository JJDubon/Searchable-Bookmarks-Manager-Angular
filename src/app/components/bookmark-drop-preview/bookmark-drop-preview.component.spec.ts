import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkDropPreviewComponent } from './bookmark-drop-preview.component';

describe('BookmarkDropPreviewComponent', () => {
  let component: BookmarkDropPreviewComponent;
  let fixture: ComponentFixture<BookmarkDropPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkDropPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkDropPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
