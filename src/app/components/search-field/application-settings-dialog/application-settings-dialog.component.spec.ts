import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSettingsDialogComponent } from './application-settings-dialog.component';

describe('ApplicationSettingsDialogComponent', () => {
  let component: ApplicationSettingsDialogComponent;
  let fixture: ComponentFixture<ApplicationSettingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationSettingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
