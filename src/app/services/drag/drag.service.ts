import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type DragTarget = { id: string, yOffset: number };
export type HoverEvent = { id: string, position: 'higher' | 'lower' };
export type BookmarkPosition = { id: string, yStart: number, height: number };

@Injectable({
  providedIn: 'root'
})
export class DragService {

  public dragTarget$ = new BehaviorSubject<DragTarget>(null);
  public hoverEvent$ = new Subject<HoverEvent>();
  public bookmarkPositions$ = new BehaviorSubject<BookmarkPosition[]>([]);

  private positions = new Map<string, BookmarkPosition>();

  constructor() {
    
  }

  public registerBookmarkNode(id: string, yStart: number, height: number): void {
    const pos = { id, yStart, height };
    this.positions.set(id, pos);
    this.bookmarkPositions$.next(Array.from(this.positions.values()));
  }

  public removeRegisteredNode(id: string): void {
    this.positions.delete(id);
    this.bookmarkPositions$.next(Array.from(this.positions.values()));
  }

  public emitHoverEvent(id: string, position: 'higher' | 'lower'): void {
    this.hoverEvent$.next({id, position});
  }

  public emitDragStart(id: string, yOffset: number): void {
    this.dragTarget$.next({ id, yOffset });
  }

  public emitDragEnd(): void {
    this.dragTarget$.next(null);
    this.hoverEvent$.next(null);
  }

}
