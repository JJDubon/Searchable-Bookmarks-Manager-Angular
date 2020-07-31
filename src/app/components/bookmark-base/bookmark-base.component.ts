import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookmark-base',
  templateUrl: './bookmark-base.component.html',
  styleUrls: ['./bookmark-base.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkBaseComponent implements OnInit {

  @Input() public title: string;
  @Input() public icon: string;

  constructor() { }

  public ngOnInit(): void {
  }

}
