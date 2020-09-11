import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApplicationSettings } from 'src/app/models/application-settings';
import { ComponentBase } from '../../component-base';

@Component({
  selector: 'app-application-settings-dialog',
  templateUrl: './application-settings-dialog.component.html',
  styleUrls: ['./application-settings-dialog.component.css']
})
export class ApplicationSettingsDialogComponent extends ComponentBase implements OnInit {

  public formGroup: FormGroup;

  constructor(
    private cd: ChangeDetectorRef,
    private dialogRef: MatDialogRef<ApplicationSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationSettings) { 

    super();

    this.formGroup = new FormGroup({
      fontSize: new FormControl(data.fontSize ?? ''),
      pageWidth: new FormControl(data.pageWidth ?? '')
    });
    
  }

  public ngOnInit(): void {

    // Change detection fix for the mat-select component
    fromEvent(window, 'click').pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.cd.detectChanges();
    });

  }

  public forceCheck(): void {
    this.cd.detectChanges();
  }

  public submit(): void {

    this.formGroup.updateValueAndValidity();
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }

    this.cd.detectChanges();

  }

}
