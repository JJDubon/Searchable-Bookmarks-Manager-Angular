import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export class ComponentBase implements OnDestroy {

  protected onDestroy$ = new Subject<boolean>();

  public ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

}