import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ContextMenuItem = { id: string, text: string, topSeparator?: boolean };

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  public contextMenu$ = new Subject<{ items: ContextMenuItem[], response$: Subject<string> }>();

  constructor() { }

  public openContextMenu(items: ContextMenuItem[]): Subject<string> {
    const response$ = new Subject<string>();
    this.contextMenu$.next({items, response$});
    return response$;
  }

}
