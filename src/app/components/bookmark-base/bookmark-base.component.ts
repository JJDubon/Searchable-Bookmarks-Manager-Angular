import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { DragService, HoverTargetEvent } from 'src/app/services/drag/drag.service';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { ComponentBase } from '../component-base';

@Component({
  selector: 'app-bookmark-base',
  templateUrl: './bookmark-base.component.html',
  styleUrls: ['./bookmark-base.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkBaseComponent extends ComponentBase implements OnInit, AfterViewInit, OnDestroy {

  @Input() public id: string;
  @Input() public title: string;
  @Input() public tooltip: string;
  @Input() public icon: string;
  @Input() public draggable: boolean = true;
  @Output() public selected = new EventEmitter<void>();
  @ViewChild("wrapper") public wrapper: ElementRef;

  public hoverTarget: HoverTargetEvent;
  public dragTarget: BookmarkBaseModel;
  public activeKeyboardTarget = false;

  private drag$: Subscription;

  constructor(private cd: ChangeDetectorRef, private dragService: DragService, private keyboardService: KeyboardService) { 
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
      this.hoverTarget = target;
      if (oldId === this.id || newId === this.id) {
        this.cd.detectChanges();
      }
    });

    // Mark this element as the active keyboard target when the service emits this element's id
    this.keyboardService.activeId$.pipe(takeUntil(this.onDestroy$)).subscribe(target => {
      
      if (target && this.activeKeyboardTarget === false && this.id === target) {
        this.activeKeyboardTarget = true;
        this.cd.detectChanges();
      } else if (this.activeKeyboardTarget && (target == null || this.id !== target)) {
        this.activeKeyboardTarget = false;
        this.cd.detectChanges();
      }

    });

  }

  public ngAfterViewInit(): void {
    if (this.draggable) {
      this.drag$ = this.dragService.attachListeners(this.id, this.wrapper);
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.drag$?.unsubscribe();
  }

  public emitClick(ev: MouseEvent): void {
    if (ev.button === 0) {
      this.selected.next();
    }
  }

}
