import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkBaseComponent } from './bookmark-base.component';

describe('BookmarkBaseComponent', () => {
  let component: BookmarkBaseComponent;
  let fixture: ComponentFixture<BookmarkBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
