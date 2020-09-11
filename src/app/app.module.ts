import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { BookmarkBaseComponent } from './components/bookmark-base/bookmark-base.component';
import { BookmarkDropPreviewComponent } from './components/bookmark-drop-preview/bookmark-drop-preview.component';
import { BookmarkFolderAddFolderDialogComponent } from './components/bookmark-folder/bookmark-folder-add-folder-dialog/bookmark-folder-add-folder-dialog.component';
import { BookmarkFolderAddLinkDialogComponent } from './components/bookmark-folder/bookmark-folder-add-link-dialog/bookmark-folder-add-link-dialog.component';
import { BookmarkFolderDeleteDialogComponent } from './components/bookmark-folder/bookmark-folder-delete-dialog/bookmark-folder-delete-dialog.component';
import { BookmarkFolderEditDialogComponent } from './components/bookmark-folder/bookmark-folder-edit-dialog/bookmark-folder-edit-dialog.component';
import { BookmarkFolderComponent } from './components/bookmark-folder/bookmark-folder.component';
import { BookmarkLinkDeleteDialogComponent } from './components/bookmark-link/bookmark-link-delete-dialog/bookmark-link-delete-dialog.component';
import { BookmarkLinkEditDialogComponent } from './components/bookmark-link/bookmark-link-edit-dialog/bookmark-link-edit-dialog.component';
import { BookmarkLinkComponent } from './components/bookmark-link/bookmark-link.component';
import { BookmarkListComponent } from './components/bookmark-list/bookmark-list.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { ApplicationSettingsDialogComponent } from './components/search-field/application-settings-dialog/application-settings-dialog.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { AllowUnsafePipe } from './pipes/allow-unsafe.pipe';

@NgModule({
  declarations: [
    AllowUnsafePipe,
    AppComponent,
    BookmarkBaseComponent,
    BookmarkDropPreviewComponent,
    BookmarkFolderAddFolderDialogComponent,
    BookmarkFolderAddLinkDialogComponent,
    BookmarkFolderComponent,
    BookmarkFolderDeleteDialogComponent,
    BookmarkFolderEditDialogComponent,
    BookmarkLinkComponent,
    BookmarkLinkDeleteDialogComponent,
    BookmarkLinkEditDialogComponent,
    BookmarkListComponent,
    ContextMenuComponent,
    SearchFieldComponent,
    ApplicationSettingsDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
