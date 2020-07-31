import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BookmarkBaseComponent } from './components/bookmark-base/bookmark-base.component';
import { BookmarkFolderComponent } from './components/bookmark-folder/bookmark-folder.component';
import { BookmarkLinkComponent } from './components/bookmark-link/bookmark-link.component';

@NgModule({
  declarations: [
    AppComponent,
    BookmarkBaseComponent,
    BookmarkFolderComponent,
    BookmarkLinkComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
