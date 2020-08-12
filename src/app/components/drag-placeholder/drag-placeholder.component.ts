import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarkLinkModel } from 'src/app/models/bookmark-link.model';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { BookmarkPosition, DragService } from 'src/app/services/drag/drag.service';
import { ComponentBase } from '../component-base';

@Component({
  selector: 'app-drag-placeholder',
  templateUrl: './drag-placeholder.component.html',
  styleUrls: ['./drag-placeholder.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DragPlaceholderComponent extends ComponentBase implements OnInit {

  public dragTarget: BookmarkBaseModel;
  public dragTargetIcon: string;
  public dragOffset: number;
  public yPosition: number;
  public yOffsetPadding = 6;

  private bookmarkPositions: BookmarkPosition[];

  constructor(private cd: ChangeDetectorRef, private bookmarksService: BookmarksService, private dragService: DragService) { 
    super();
  }

  public ngOnInit(): void {

    // Listen for drag events
    this.dragService.dragTarget$.pipe(takeUntil(this.onDestroy$)).subscribe(target => {
      
      if (target) {

        this.dragTarget = this.bookmarksService.getBookmark(target.id);
        this.dragOffset = target.yOffset;
        this.dragTargetIcon = (this.dragTarget as BookmarkLinkModel)?.url ? (this.dragTarget as BookmarkLinkModel).icon : '/assets/images/folder.svg'

        fromEvent(window, 'mouseup').pipe(first()).subscribe(() => {
          this.dragTarget = null;
          this.dragService.emitDragEnd();
          this.cd.detectChanges();
        });

      } else {
        this.dragTarget = null;
      }

      this.cd.detectChanges();

    });

    // Keep track of the mouse position
    fromEvent(window, "mousemove").pipe(takeUntil(this.onDestroy$)).subscribe((ev: MouseEvent) => {
      this.yPosition = ev.clientY;
      if (this.dragTarget) {
        this.emitHoverEvent()
        this.cd.detectChanges();
      }
    });

    // Store the positions of each bookmark node
    this.dragService.bookmarkPositions$.pipe(takeUntil(this.onDestroy$)).subscribe((positions) => {
      this.bookmarkPositions = positions;
    });

  }

  private emitHoverEvent(): void {
    
    for (let i = 0; i < this.bookmarkPositions.length; i++) {
      const upperBound = this.bookmarkPositions[i].yStart;
      const lowerBound = this.bookmarkPositions[i].yStart + this.bookmarkPositions[i].height;
      if (this.yPosition > upperBound && this.yPosition < lowerBound) {
        const midLine = this.bookmarkPositions[i].yStart + (this.bookmarkPositions[i].height / 2);
        if (this.yPosition < midLine) {
          this.dragService.emitHoverEvent(this.bookmarkPositions[i].id, 'higher');
        } else {
          this.dragService.emitHoverEvent(this.bookmarkPositions[i].id, 'lower');
        }

        break;
      }
    }


  }

}
