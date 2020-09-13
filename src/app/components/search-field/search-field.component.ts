import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { ApplicationSettings } from 'src/app/models/application-settings';
import { ApplicationService } from 'src/app/services/application/application.service';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { DragService } from 'src/app/services/drag/drag.service';
import { KeyboardService } from 'src/app/services/keyboard/keyboard.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { WindowToken } from 'src/window';
import { ComponentBase } from '../component-base';
import { ApplicationSettingsDialogComponent } from './application-settings-dialog/application-settings-dialog.component';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFieldComponent extends ComponentBase implements OnInit {

  @ViewChild("searchInputField") public searchInputField: ElementRef;
  public searchText: string;

  constructor(
    @Inject(WindowToken) private window: Window,
    private cd: ChangeDetectorRef, 
    private dialog: MatDialog, 
    private applicationService: ApplicationService,
    private storageService: StorageService,
    private bookmarkService: BookmarksService, 
    private dragService: DragService,
    private keyboardService: KeyboardService) { 
    super();
  }

  public ngOnInit(): void {

    // Either clear a search or close the extension in response to the close event
    this.keyboardService.closeEvent$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      if (this.searchText == null || this.searchText.length === 0) {
        this.window.close();
      } else {
        this.closeSearch();
      }
    });

    // Focus the search input when a keyboard event takes place
    this.keyboardService.keyboardInput$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.searchInputField?.nativeElement?.focus();
    });

  }

  public onSearchTextChange(updatedText: string): void {

    // Update the search text and either queue a new search or end the existing search (if the search text is empty)
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

    this.storageService.getApplicationSettings().pipe(takeUntil(this.onDestroy$)).subscribe(settings => {

      const dialogRef = this.dialog.open(ApplicationSettingsDialogComponent, {
        width: '320px',
        autoFocus: true,
        data: settings
      });
  
      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe((result: ApplicationSettings) => {
        if (result) {
          this.storageService.setApplicationSettings(result).subscribe(() => {
            this.applicationService.applySettings();
          });
        }
      });

    });

  }

}
