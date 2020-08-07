import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bookmark-folder-add-link-dialog',
  templateUrl: './bookmark-folder-add-link-dialog.component.html',
  styleUrls: ['./bookmark-folder-add-link-dialog.component.css']
})
export class BookmarkFolderAddLinkDialogComponent implements OnInit {

  public urlIsInvalid = false;
  public formGroup: FormGroup;

  constructor(
    private cd: ChangeDetectorRef,
    private dialogRef: MatDialogRef<BookmarkFolderAddLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, url: string }) { 
      this.formGroup = new FormGroup({
        url: new FormControl(data.title ?? ''),
        title: new FormControl(data.url ?? '')
      });
    }

  ngOnInit(): void {
  }

  public submit(): void {

    this.formGroup.updateValueAndValidity();
    if (this.formGroup.valid) {
      const result = { title: this.formGroup.value.title ?? '', url: this.formGroup.value.url ?? '' };
      const hasValidHttpOrHttps = result.url.indexOf("http://") === 0 && result.url.indexOf("https://") === 0;
      if (!hasValidHttpOrHttps) {
        result.url = "http://" + result.url;
      }

      this.dialogRef.close(result);
    }

    this.cd.detectChanges();

  }

}
