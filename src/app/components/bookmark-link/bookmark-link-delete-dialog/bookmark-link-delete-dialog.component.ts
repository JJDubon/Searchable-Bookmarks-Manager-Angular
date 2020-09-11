import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bookmark-link-delete-dialog',
  templateUrl: './bookmark-link-delete-dialog.component.html',
  styleUrls: ['./bookmark-link-delete-dialog.component.css']
})
export class BookmarkLinkDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BookmarkLinkDeleteDialogComponent>) { }

  public ngOnInit(): void {
  }

  public submit(result: { title: string, action: string }): void {
    this.dialogRef.close(result);
  }

}
