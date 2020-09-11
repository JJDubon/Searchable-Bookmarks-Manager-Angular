import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bookmark-folder-edit-dialog',
  templateUrl: './bookmark-folder-edit-dialog.component.html',
  styleUrls: ['./bookmark-folder-edit-dialog.component.css']
})
export class BookmarkFolderEditDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BookmarkFolderEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }) { }

  public ngOnInit(): void {
  }

  public submit(result: { title: string, action: string }): void {
    this.dialogRef.close(result);
  }

}
