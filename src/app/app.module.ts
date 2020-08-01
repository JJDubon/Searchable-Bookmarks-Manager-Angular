import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { BookmarkBaseComponent } from './components/bookmark-base/bookmark-base.component';
import { BookmarkFolderComponent } from './components/bookmark-folder/bookmark-folder.component';
import { BookmarkLinkComponent } from './components/bookmark-link/bookmark-link.component';
import { BookmarkListComponent } from './components/bookmark-list/bookmark-list.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { AllowUnsafePipe } from './pipes/allow-unsafe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BookmarkBaseComponent,
    BookmarkFolderComponent,
    BookmarkLinkComponent,
    BookmarkListComponent,
    AllowUnsafePipe,
    ContextMenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatRippleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
