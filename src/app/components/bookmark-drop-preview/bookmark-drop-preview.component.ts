import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BookmarkBaseModel } from 'src/app/models/bookmark-base.model';
import { BookmarkTypes } from 'src/app/models/bookmark-types.model';
import { DragService } from 'src/app/services/drag/drag.service';
import { ComponentBase } from '../component-base';

@Component({
  selector: 'app-bookmark-drop-preview',
  templateUrl: './bookmark-drop-preview.component.html',
  styleUrls: ['./bookmark-drop-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkDropPreviewComponent extends ComponentBase implements OnInit {

  public dragTarget: BookmarkBaseModel;
  public BookmarkTypes = BookmarkTypes;

  constructor(private cd: ChangeDetectorRef, private dragService: DragService) { 
    super();
  }

  public ngOnInit(): void {

    // Render the drop ghost from the item the service is actively dragging
    this.dragService.dragTarget$.pipe(takeUntil(this.onDestroy$)).subscribe(target => {
      this.dragTarget = target;
      this.cd.detectChanges();
    });

  }

}
