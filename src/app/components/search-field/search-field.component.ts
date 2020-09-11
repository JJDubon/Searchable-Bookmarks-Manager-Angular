import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { ApplicationSettings } from 'src/app/models/application-settings';
import { ApplicationService } from 'src/app/services/application/application.service';
import { BookmarksService } from 'src/app/services/bookmarks/bookmarks.service';
import { DragService } from 'src/app/services/drag/drag.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ComponentBase } from '../component-base';
import { ApplicationSettingsDialogComponent } from './application-settings-dialog/application-settings-dialog.component';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFieldComponent extends ComponentBase implements OnInit {

  public searchText: string;

  constructor(
    private cd: ChangeDetectorRef, 
    private dialog: MatDialog, 
    private applicationService: ApplicationService,
    private storageService: StorageService,
    private bookmarkService: BookmarksService, 
    private dragService: DragService) { 
    super();
  }

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
