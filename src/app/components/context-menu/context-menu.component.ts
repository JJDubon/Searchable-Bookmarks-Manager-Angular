import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContextMenuItem, ContextMenuService } from '../../services/context-menu/context-menu.service';
import { ComponentBase } from '../component-base';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent extends ComponentBase implements OnInit {

  @ViewChild(MatMenuTrigger) public menuTrigger: MatMenuTrigger;

  public items: ContextMenuItem[];
  public isOpen = false;
  public isOpening = false;
  public activeSubject: Subject<string>;
  public activePosition: { x: number, y: number } = { x: 0, y: 0 };
  public contextMenuPosition: { x: number, y: number } = { x: 0, y: 0 };

  constructor(private cd: ChangeDetectorRef, @Inject(DOCUMENT) private document: any, private contextMenuService: ContextMenuService) {
    super();
  }

  ngOnInit(): void {

    // This context menu is opened through an observable attached to a service
    this.contextMenuService.contextMenu$.pipe(takeUntil(this.onDestroy$)).subscribe(options => {

      if (this.isOpen) {
        this.close();
      }

      this.isOpening = true;
      this.items = options.items;
      this.activeSubject = options.response$;
      this.open();

    });

    // Keep track of the mouse's position in the document
    fromEvent(this.document, "mousemove").pipe(takeUntil(this.onDestroy$)).subscribe((ev: MouseEvent) => {
      this.activePosition = { x: ev.clientX, y: ev.clientY };
    });

    // Close the context menu in response to a click event
    fromEvent(this.document, "mouseup").pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      if (this.isOpening) {
        this.isOpening = false;
      } else if(this.isOpen) {
        this.close();
      }
    });

  }

  private open(): void {

    this.isOpen = true;
    this.contextMenuPosition = this.activePosition;

    this.cd.detectChanges();
    this.menuTrigger.menu.focusFirstItem('mouse');
    this.menuTrigger.openMenu();
    this.cd.detectChanges();

  }

  private close(): void {
    this.isOpen = false;
    this.menuTrigger.closeMenu();
    this.cd.detectChanges();
  }

  public emitItemSelected(id: string): void {
    if (this.activeSubject) {
      this.activeSubject.next(id);
      this.activeSubject.complete();
      this.activeSubject = null;
    }
  }

}
