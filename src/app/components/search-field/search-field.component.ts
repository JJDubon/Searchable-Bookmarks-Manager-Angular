import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { DragService } from 'src/app/services/drag/drag.service';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFieldComponent implements OnInit {

  public searchText: string;

  constructor(private cd: ChangeDetectorRef, private bookmarkService: BookmarksService, private dragService: DragService) { }

  public ngOnInit(): void {
  }

  public onSearchTextChange(updatedText: string): void {

    this.searchText = updatedText;
    if (this.searchText && this.searchText.length !== 0) {
      this.bookmarkService.search(this.searchText);
      this.dragService.disableDragging();
    } else {
      this.closeSearch();
    }

    this.cd.markForCheck();

  }

  public closeSearch(): void {
    this.searchText = '';
    this.bookmarkService.closeSearch();
    this.dragService.enableDragging();
    this.cd.markForCheck();
  }

  public showSettings(): void {
    // TODO
  }

}
