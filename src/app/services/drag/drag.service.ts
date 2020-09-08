import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarkFolderModel } from 'src/app/models/bookmark-folder.model';
import { BookmarkTypes } from 'src/app/models/bookmark-types.model';
import { BookmarksService } from '../bookmarks/bookmarks.service';

export type HoverTargetTypes = 'top' | 'bottom' | 'inside';
export type DragEventTypes = 'dragstart' | 'dragend' | 'dragenter' | 'dragexit' | 'dragover';
export type DragEventExt = DragEvent & { serviceEventType: DragEventTypes };

@Injectable({
  providedIn: 'root'
})
export class DragService {

  public dragTarget$ = new BehaviorSubject<BookmarkBaseModel>(null);
  public hoverTarget$ = new Subject<{ id: string, type: HoverTargetTypes }>();

  private dragTarget: BookmarkBaseModel;
  private hoverTarget: { id: string, type: HoverTargetTypes };

  constructor(private bookmarkService: BookmarksService) {

    this.dragTarget$.subscribe(target => {
      this.dragTarget = target;
    });

    this.hoverTarget$.subscribe(target => {
      this.hoverTarget = target;
    });

  }

  public enableDrag(id: string, element: ElementRef<HTMLElement>): Subscription {

    const dragStart = fromEvent<DragEvent>(element.nativeElement, 'dragstart').pipe(map(ev => dragEvToExt(ev, 'dragstart')));
    const dragEnd = fromEvent<DragEvent>(element.nativeElement, 'dragend').pipe(map(ev => dragEvToExt(ev, 'dragend')));
    const dragEnter = fromEvent<DragEvent>(element.nativeElement, 'dragenter').pipe(map(ev => dragEvToExt(ev, 'dragenter')));
    const dragOver = fromEvent<DragEvent>(element.nativeElement, 'dragover').pipe(map(ev => dragEvToExt(ev, 'dragover')));
    const dragExit = fromEvent<DragEvent>(element.nativeElement, 'dragexit').pipe(map(ev => dragEvToExt(ev, 'dragexit')));

    // Combine drag events into one subscription so it can be easily removed from memory in the component that calls this method
    return merge(dragStart, dragEnd, dragEnter, dragExit, dragOver).subscribe((event: DragEventExt) => {

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
        case 'dragexit':
          this.onDragExit();
          break;
      }

    });

  }

  private onDragStart(id: string, ev: DragEvent): void {
    ev.dataTransfer.setDragImage((ev.target as HTMLElement).querySelector('.bookmark-icon'), -8, -4);
    window.requestAnimationFrame(() => { (ev.target as HTMLElement).style.opacity = '0' });
    this.dragTarget$.next(this.bookmarkService.getBookmark(id));
  }

  private onDragEnd(ev: DragEvent): void {

    // TODO - Handle drop using both the dragTarget and hoverTarget members

    window.requestAnimationFrame(() => { (ev.target as HTMLElement).style.opacity = '1' });
    this.dragTarget$.next(null);

  }

  private onDragEnter(id: string, ev: DragEvent): void {
    this.determineHoverType(id, ev);
  }

  private onDragOver(id: string, ev: DragEvent): void {
    this.determineHoverType(id, ev);
  }

  private onDragExit(): void {
    this.hoverTarget$.next(null);
  }

  private determineHoverType(id: string, ev: DragEvent): void {
    const targetItem = this.bookmarkService.getBookmark(id);
    const targetRect = (ev.target as HTMLElement).getBoundingClientRect();
    const eventY = ev.y;

    const isTopHalf = eventY < (targetRect.y + (targetRect.height/2));
    const isFolder = targetItem.type === BookmarkTypes.Folder;
    const isOpen = isFolder && (targetItem as BookmarkFolderModel).isOpen === true
    if ((isFolder && isOpen) || (isFolder && isTopHalf)) {
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

function emptyImage(): HTMLImageElement {
  const image = new Image();
  image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
  return image;
}
