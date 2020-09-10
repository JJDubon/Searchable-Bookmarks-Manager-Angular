import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFieldComponent implements OnInit {

  public searchText: string;

  constructor(private cd: ChangeDetectorRef) { }

  public ngOnInit(): void {
  }

  public onSearchTextChange(updatedText: string): void {
    this.searchText = updatedText;
    this.cd.markForCheck();
  }

  public closeSearch(): void {
    this.searchText = '';
    this.cd.markForCheck();
  }

}
