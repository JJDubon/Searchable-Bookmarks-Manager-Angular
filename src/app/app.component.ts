import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentBase } from './components/component-base';
import { BookmarksService } from './services/bookmarks/bookmarks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends ComponentBase implements OnInit {

  private subs: Subscription[] = [];

  constructor(private bookmarksService: BookmarksService) {
    super();
  }

  public ngOnInit(): void {
    
    this.bookmarksService.initialized$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {

      const topLevelNodes = this.bookmarksService.getTopLevelNodes();
      console.log("topLevelNodes", topLevelNodes);

    });
    
  }
  
}
