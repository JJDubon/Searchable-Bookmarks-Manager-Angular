import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarkTypes } from 'src/app/models/bookmark-types.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { DragService, HoverTargetEvent } from 'src/app/services/drag/drag.service';
import { ComponentBase } from '../component-base';

@Component({
  selector: 'app-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkListComponent extends ComponentBase implements OnInit, OnChanges {

  @Input() public bookmarkIds: string[];
  public bookmarks: BookmarkBaseModel[];
  public BookmarkTypes = BookmarkTypes;

  public hoverTarget: HoverTargetEvent;
  public dragTarget: BookmarkBaseModel;

  constructor(private cd: ChangeDetectorRef, private bookmarksService: BookmarksService, private dragService: DragService) { 
    super();
  }

  public ngOnInit(): void {

    // Determine whether this element is being dragged
    this.dragService.dragTarget$.pipe(takeUntil(this.onDestroy$)).subscribe(target => {
      this.dragTarget = target;
    });

    // Determine whether a hover event is taking place over this element
    this.dragService.hoverTarget$.pipe(takeUntil(this.onDestroy$)).subscribe(target => {
      const oldId = this.hoverTarget?.id;
      const newId = target?.id;
      const bookmarkIds = new Set(this.bookmarkIds ?? []);
      this.hoverTarget = target;
      if (bookmarkIds.has(oldId) || bookmarkIds.has(newId)) {
        this.cd.detectChanges();
      }
    });
    
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.bookmarkIds && this.bookmarkIds) {
      this.loadBookmarks();
    }
  }

  public loadBookmarks(): void {
    this.bookmarks = (this.bookmarkIds ?? []).map(id => this.bookmarksService.getBookmark(id));
    this.cd.detectChanges();
  }

  public showDragTopPreview(index: number): boolean {

    if (index !== 0 || this.hoverTarget == null || this.dragTarget == null) {
      return false;
    }

    const bookmarkIsHoverTarget = this.hoverTarget.id === this.bookmarks[index].id;
    const bookmarkIsDragTarget = this.dragTarget.id  === this.bookmarks[index].id;
    return bookmarkIsHoverTarget && !bookmarkIsDragTarget && this.hoverTarget.type === 'top';

  }

  public showDragBottomPreview(index: number): boolean {

    if (this.hoverTarget == null || this.dragTarget == null) {
      return false;
    }

    const bookmarkIsHoverTarget = this.hoverTarget.id === this.bookmarks[index].id;
    const bookmarkIsDragTarget = this.dragTarget.id  === this.bookmarks[index].id;
    const lastItemInList = (index + 1) === this.bookmarks.length;
    const nextBookmarkIsHoverTarget = !lastItemInList && this.hoverTarget.id === this.bookmarks[index + 1].id;
    const nextBookmarkIsDragTarget = !lastItemInList && this.dragTarget.id === this.bookmarks[index + 1].id;

    if (bookmarkIsDragTarget || nextBookmarkIsDragTarget) {
      return false;
    }

    return (bookmarkIsHoverTarget && this.hoverTarget.type === 'bottom')
        || (nextBookmarkIsHoverTarget && this.hoverTarget.type === 'top');

  }

  public trackById(index: number, bookmark: BookmarkBaseModel): string {
    return index + bookmark.id;
  }

}
