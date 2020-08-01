import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bookmark-folder-delete-dialog',
  templateUrl: './bookmark-folder-delete-dialog.component.html',
  styleUrls: ['./bookmark-folder-delete-dialog.component.css']
})
export class BookmarkFolderDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BookmarkFolderDeleteDialogComponent>) { }

  ngOnInit(): void {
  }

  public submit(result: { title: string, action: string }): void {
    this.dialogRef.close(result);
  }

}
