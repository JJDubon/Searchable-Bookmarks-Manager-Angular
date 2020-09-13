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
    @Inject(WindowToken) private window: Window,
    private bookmarkService: BookmarksService) { 

    this.dragTarget$.subscribe(target => {
      this.dragTarget = target;
    });

    this.hoverTarget$.subscribe(target => {
      this.hoverTarget = target;
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
    return merge(dragStart, dragEnd, dragEnter, dragOver).subscribe((event: DragEventExt) => {

      switch (event.serviceEventType) {
        case 'dragstart':
          this.onDragStart(id, event);
          break;
        case 'dragend':
          this.onDragEnd(event);
          break;
        case 'dragenter':
          this.onDragEnter(id, event);
          break;
        case 'dragover':
          this.onDragOver(id, event);
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

      // Set the drag image to be a representation of the dragged element, and hide the original element
      ev.dataTransfer.setDragImage((ev.target as HTMLElement).querySelector('.bookmark-icon'), -8, -4);
      this.dragTarget$.next(this.bookmarkService.getBookmark(id));
      this.window.requestAnimationFrame(() => { 
        (ev.target as HTMLElement).classList.add('hidden');
      });

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
    this.determineHoverType(id, ev);
  }

  private determineHoverType(id: string, ev: DragEvent): void {

    const targetItem = this.bookmarkService.getBookmark(id);
    const targetRect = (ev.target as HTMLElement).getBoundingClientRect();
    const eventY = ev.y;

    // Determine hover behavior
    const isTopHalf = eventY < (targetRect.y + (targetRect.height/2));
    const isFolder = targetItem.type === BookmarkTypes.Folder;
    const isOpen = isFolder && (targetItem as BookmarkFolderModel).isOpen === true
    if ( (isOpen && !isTopHalf) || (isFolder && !targetItem.modifiable) ) {
      this.hoverTarget$.next({ id, type: 'inside' });
    } else if (isTopHalf) {
      this.hoverTarget$.next({ id, type: 'top' });
    } else {
      this.hoverTarget$.next({ id, type: 'bottom' });
    }

  }

}

function dragEvToExt(event: DragEvent, type: DragEventTypes): DragEventExt {
  const ext = event as DragEventExt;
  ext.serviceEventType = type;
  return ext;
}
