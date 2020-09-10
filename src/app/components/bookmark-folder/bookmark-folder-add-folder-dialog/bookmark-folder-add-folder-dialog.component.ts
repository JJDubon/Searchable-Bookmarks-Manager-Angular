import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bookmark-folder-add-folder-dialog',
  templateUrl: './bookmark-folder-add-folder-dialog.component.html',
  styleUrls: ['./bookmark-folder-add-folder-dialog.component.css']
})
export class BookmarkFolderAddFolderDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BookmarkFolderAddFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }) { }

  ngOnInit(): void {
  }

  public submit(result: { title: string }): void {
    this.dialogRef.close(result);
  }

}
