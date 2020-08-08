import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';
import { DragService } from '../../services/drag/drag.service';

@Component({
  selector: 'app-bookmark-base',
  templateUrl: './bookmark-base.component.html',
  styleUrls: ['./bookmark-base.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkBaseComponent implements OnInit {

  @Input() public id: string;
  @Input() public title: string;
  @Input() public tooltip: string;
  @Input() public icon: string;
  @Input() public allowDrag = true;
  @Output() public selected = new EventEmitter<void>();

  private mouseIsDown = false;
  private dragging = false;
  private dragOffset: number;

  constructor(private dragService: DragService) { }

  public ngOnInit(): void {
  }

  public emitClick(): void {
    this.mouseIsDown = false;
    this.selected.next();
  }

  public onMouseDown(ev: DragEvent, wrapper: HTMLDivElement): void {

    clearSelection();

    if (this.allowDrag) {

      ev.stopPropagation();
      ev.preventDefault();
      this.mouseIsDown = true;
      this.dragOffset = ev.clientY - wrapper.getBoundingClientRect().top;

      fromEvent(window, 'mouseup').pipe(first()).subscribe(() => {
        this.mouseIsDown = false;
      });

    }

  }

  public onMouseMove(ev: DragEvent, wrapper: HTMLDivElement): void {

    if (this.allowDrag && this.mouseIsDown && !this.dragging) {

      ev.stopPropagation();
      ev.preventDefault();

      this.dragging = true;
      this.dragService.emitDragStart(this.id, this.dragOffset);

      fromEvent(window, 'mouseup').pipe(first()).subscribe(() => {
        this.dragging = false;
      });
      
    } else if (this.allowDrag && this.mouseIsDown && this.dragging) {

      // TODO - Figure out hover
      // const rect = wrapper.getBoundingClientRect();
      // const yPosition = ev.clientY;
      // const evPosition = (rect.top + rect.height/2) < yPosition ? 'lower' : 'higher';
      // this.dragService.emitHoverEvent(this.id, evPosition);

    }

  }

}

function clearSelection(): void {
 if (window.getSelection) {window.getSelection().removeAllRanges();}
}
