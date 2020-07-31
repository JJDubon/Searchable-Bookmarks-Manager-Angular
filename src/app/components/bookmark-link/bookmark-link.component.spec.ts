import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkLinkComponent } from './bookmark-link.component';

describe('BookmarkLinkComponent', () => {
  let component: BookmarkLinkComponent;
  let fixture: ComponentFixture<BookmarkLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
