import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';

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
  @Output() public selected = new EventEmitter<void>();
  @ViewChild("wrapper") public wrapper: ElementRef;

  constructor() { }

  public ngOnInit(): void {
  }

  public emitClick(): void {
    this.selected.next();
  }

}
