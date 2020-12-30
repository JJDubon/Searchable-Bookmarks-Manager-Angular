import { DOCUMENT } from '@angular/common';
import { ElementRef, Inject, Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarkTypes } from 'src/app/models/bookmark-types.model';
import { WindowToken } from 'src/window';
import { BookmarksService } from '../bookmarks/bookmarks.service';

export type HoverTargetTypes = 'top' | 'bottom' | 'inside';
export type HoverTargetEvent = { id: string, type: HoverTargetTypes };
export type DragEventTypes = 'dragstart' | 'dragend' | 'dragenter' | 'dragover';
export type DragEventExt = DragEvent & { serviceEventType: DragEventTypes };

@Injectable({
  providedIn: 'root'
})
export class DragService {

  public dragTarget$ = new BehaviorSubject<BookmarkBaseModel>(null);
  public hoverTarget$ = new Subject<HoverTargetEvent>();

  private draggingEnabled = true;
  private dragTarget: BookmarkBaseModel;
  private hoverTarget: HoverTargetEvent;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WindowToken) private window: Window,
    private bookmarkService: BookmarksService) { 

    this.dragTarget$.subscribe(target => {
      this.dragTarget = target;
    });

    this.hoverTarget$.subscribe(target => {
      this.hoverTarget = target;
    });

    // Force cursor on windows
    fromEvent<DragEvent>(document, 'dragover').subscribe(ev => {
      ev.preventDefault();
      ev.stopPropagation();
      ev.dataTransfer.dropEffect = 'move';
    });

    // Fix a bug on windows where a selection may break the HTML5 drag-and-drop functionality
    let timeout: number = null;
    fromEvent<MouseEvent>(document, 'mousedown').subscribe(ev => {

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        this.dragTarget$.next(null);
        this.hoverTarget$.next(null);
        this.document.getSelection().removeAllRanges();
        this.window.requestAnimationFrame(() => { 
          document.querySelectorAll('.hidden').forEach((el) => {
            el.classList.remove('hidden');
          });
        });
      }, 50);

    });
  
  }

  public enableDragging(): void {
    this.draggingEnabled = true;
  }

  public disableDragging(): void {
    this.draggingEnabled = false;
  }

  public attachListeners(id: string, element: ElementRef<HTMLElement>): Subscription {

    const dragStart = fromEvent<DragEvent>(element.nativeElement, 'dragstart').pipe(map(ev => dragEvToExt(ev, 'dragstart')));
    const dragEnd = fromEvent<DragEvent>(element.nativeElement, 'dragend').pipe(map(ev => dragEvToExt(ev, 'dragend')));
    const dragEnter = fromEvent<DragEvent>(element.nativeElement, 'dragenter').pipe(map(ev => dragEvToExt(ev, 'dragenter')));
    const dragOver = fromEvent<DragEvent>(element.nativeElement, 'dragover').pipe(map(ev => dragEvToExt(ev, 'dragover')));

    // Combine drag events into one subscription so it can be easily removed from memory in the component that calls this method
    return merge(dragStart, dragEnd, dragEnter, dragOver).subscribe((ev: DragEventExt) => {

      if (ev.dataTransfer && ev.serviceEventType != 'dragend') {
        let icon = this.document.querySelector('img[data-icon-id="' + id + '"]');
        ev.dataTransfer.setDragImage(icon, -12, -8);
      }

      switch (ev.serviceEventType) {
        case 'dragstart':
          this.onDragStart(id, ev);
          break;
        case 'dragend':
          this.onDragEnd(ev);
          break;
        case 'dragenter':
          this.onDragEnter(id, ev);
          break;
        case 'dragover':
          this.onDragOver(id, ev);
          break;
      }

    });

  }

  private onDragStart(id: string, ev: DragEvent): void {

    const targetItem = this.bookmarkService.getBookmark(id);

    // If dragging is enabled or this even has taken place on an unmodifiable folder, suppress drag start
    if (!this.draggingEnabled || !targetItem.modifiable) {

      ev.preventDefault();

    } else {

      // Set the drag image to be a representation of the dragged element
      let icon = this.document.querySelector('img[data-icon-id="' + id + '"]');
      ev.dataTransfer.setDragImage(icon, -12, -8);

      // Note: This timeout fixes a small jump at the start of the event on Windows
      setTimeout(() => {

        // Hide the original element
        this.dragTarget$.next(this.bookmarkService.getBookmark(id));
        this.window.requestAnimationFrame(() => { 
          (ev.target as HTMLElement).classList.add('hidden');
        });

      }, 50);

    }

  }

  private onDragEnd(ev: DragEvent): void {

    const dragTarget = this.dragTarget;
    const hoverTarget = this.hoverTarget;

    // Reset service and hidden dom elements
    this.dragTarget$.next(null);
    this.hoverTarget$.next(null);
    this.window.requestAnimationFrame(() => { 
      (ev.target as HTMLElement).classList.remove('hidden');
    });

    // Fix a bug on windows where drag functionality may break if a user clicks multiple times very quickly, slightly moving
    // the mouse between each click
    if (dragTarget == null || hoverTarget == null) {
      return;
    }

    // If there is a proper hover target, perform the drop logic
    if (hoverTarget != null) {

      const hoverTargetItem = this.bookmarkService.getBookmark(hoverTarget.id);
      let parentFolder: BookmarkFolderModel = null;
      let index = 0;

      // Determine the parent the drag target will eventually get moved to
      if (hoverTargetItem.type === BookmarkTypes.Link || hoverTarget.type !== 'inside') {

        // Determine the drag target's new index just above or below the hover target
        parentFolder = this.bookmarkService.getBookmark(hoverTargetItem.parentId) as BookmarkFolderModel;
        if (hoverTarget.type === 'top') {
          index = parentFolder.children.indexOf(hoverTargetItem.id);
        } else {
          index = parentFolder.children.indexOf(hoverTargetItem.id) + 1;
        }

      } else {

        // Add the item as the first element in the list
        parentFolder = hoverTargetItem as BookmarkFolderModel;
        index = 0;

      }

      // Perform a final check to ensure a parent folder isn't being moved into it's own child list
      if (parentFolder.id != dragTarget.id && !this.bookmarkService.idRepresentsChildOf(parentFolder.id, dragTarget.id)) {

        // Pass the request to chrome's api
        index = index < 0 ? 0 : index;
        this.bookmarkService.moveBookmark(dragTarget.id, parentFolder.id, index);

      }

    }

  }

  private onDragEnter(id: string, ev: DragEvent): void {
    this.determineHoverType(id, ev);
  }

  private onDragOver(id: string, ev: DragEvent): void {

    // Force cursor on windows
    ev.preventDefault();
    ev.stopPropagation();
    ev.dataTransfer.dropEffect = 'move';

    this.determineHoverType(id, ev);

  }

  private determineHoverType(id: string, ev: DragEvent): void {

    const targetItem = this.bookmarkService.getBookmark(id);
    const targetRect = (ev.target as HTMLElement).getBoundingClientRect();
    const eventY = ev.y;

    // Determine what vertical position this event took place in the element
    const elStart = targetRect.y;
    const elEnd = targetRect.y + targetRect.height;
    const precisionAsPercent = (eventY - elStart) / (elEnd - elStart);
    
    // Determine hover behavior
    const isFolder = targetItem.type === BookmarkTypes.Folder;
    const isOpen = isFolder && (targetItem as BookmarkFolderModel).isOpen === true;
    const isModifiableFolder = isFolder && targetItem.modifiable;
    if (isModifiableFolder) {

      if (isOpen) {

        // If the folder is open than anything below 75% places the item inside of the folder
        if (precisionAsPercent <= 0.25) {
          this.hoverTarget$.next({ id, type: 'top' });
        } else {
          this.hoverTarget$.next({ id, type: 'inside' });
        }

      } else {

        // If the folder is closed, the top 25% is above, the bottom 25% is below, and the middle
        // 50% places the item inside of the folder
        if (precisionAsPercent <= 0.25) {
          this.hoverTarget$.next({ id, type: 'top' });
        } else if (precisionAsPercent >= 0.75) {
          this.hoverTarget$.next({ id, type: 'bottom' });
        } else {
          this.hoverTarget$.next({ id, type: 'inside' });
        }

      }

    } else if (isFolder) {

      // If the folder is not modifiable, always place inside
      this.hoverTarget$.next({ id, type: 'inside' });

    } else {

      // Place the item above or below the link based on whether the event takes place in the top
      // 50% of the element or the bottom 50%.
      const isTopHalf = precisionAsPercent <= 0.5;
      if (isTopHalf) {
        this.hoverTarget$.next({ id, type: 'top' });
      } else {
        this.hoverTarget$.next({ id, type: 'bottom' });
      }

    }

  }

}

function dragEvToExt(ev: DragEvent, type: DragEventTypes): DragEventExt {
  const ext = ev as DragEventExt;
  ext.serviceEventType = type;
  return ext;
}
