import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  private clickTimeout: any;

  constructor(private dragService: DragService) { }

  public ngOnInit(): void {
  }

  public emitClick(): void {
    
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }

    this.selected.next();

  }

  public onDragStart(ev: DragEvent, wrapper: HTMLDivElement): void {

    clearSelection();
    if (this.allowDrag) {

      this.clickTimeout= setTimeout(() => {

        ev.stopPropagation();
        ev.preventDefault();
  
        const offset = ev.clientY - wrapper.getBoundingClientRect().top;
        this.dragService.emitDragStart(this.id, offset);

        this.clickTimeout = null;

      }, 100);

    }
  }

  public onDragOver(ev: DragEvent, wrapper: HTMLDivElement): void {

    if (this.allowDrag) {

      ev.stopPropagation();
      ev.preventDefault();

      const rect = wrapper.getBoundingClientRect();
      const yPosition = ev.clientY;
      const evPosition = (rect.top + rect.height/2) < yPosition ? 'lower' : 'higher';
      this.dragService.emitHoverEvent(this.id, evPosition);

    }

  }

}

function clearSelection(): void {
 if (window.getSelection) {window.getSelection().removeAllRanges();}
}
