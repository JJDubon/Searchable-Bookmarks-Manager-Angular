import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DragService } from 'src/app/services/drag/drag.service';

@Component({
  selector: 'app-bookmark-base',
  templateUrl: './bookmark-base.component.html',
  styleUrls: ['./bookmark-base.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() public id: string;
  @Input() public title: string;
  @Input() public tooltip: string;
  @Input() public icon: string;
  @Input() public draggable: boolean = true;
  @Output() public selected = new EventEmitter<void>();
  @ViewChild("wrapper") public wrapper: ElementRef;

  private drag$: Subscription;

  constructor(private dragService: DragService) { }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    if (this.draggable) {
      this.drag$ = this.dragService.enableDrag(this.id, this.wrapper);
    }
  }

  public ngOnDestroy(): void {
    this.drag$?.unsubscribe();
  }

  public emitClick(): void {
    this.selected.next();
  }

}
