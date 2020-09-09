import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { DragService, HoverTargetEvent } from 'src/app/services/drag/drag.service';
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

  private drag$: Subscription;

  constructor(private cd: ChangeDetectorRef, private dragService: DragService) { 
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

  }

  public ngAfterViewInit(): void {
    if (this.draggable) {
      this.drag$ = this.dragService.enableDrag(this.id, this.wrapper);
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.drag$?.unsubscribe();
  }

  public emitClick(): void {
    this.selected.next();
  }

}
