import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type DragTarget = { id: string, yOffset: number };
export type HoverEvent = { id: string, position: 'higher' | 'lower' };

@Injectable({
  providedIn: 'root'
})
export class DragService {

  public dragTarget$ = new BehaviorSubject<DragTarget>(null);
  public hoverEvent$ = new Subject<HoverEvent>();

  constructor() { }

  public emitHoverEvent(id: string, position: 'higher' | 'lower'): void {
    console.log("test", { id, position });
    this.hoverEvent$.next({ id, position });
  }

  public emitDragStart(id: string, yOffset: number): void {
    this.dragTarget$.next({ id, yOffset });
  }

  public emitDragEnd(): void {
    this.dragTarget$.next(null);
  }

}
