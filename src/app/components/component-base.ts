import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({ selector: 'app-base', template: '' }) // Unused, suppresses an angular build warning
export abstract class ComponentBase implements OnDestroy {

  protected onDestroy$ = new Subject<boolean>();

  public ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

}