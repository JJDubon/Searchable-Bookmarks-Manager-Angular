import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WindowToken } from 'src/window';
import { ApplicationSettingsDialogComponent } from './application-settings-dialog.component';

describe('ApplicationSettingsDialogComponent', () => {
  let component: ApplicationSettingsDialogComponent;
  let fixture: ComponentFixture<ApplicationSettingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationSettingsDialogComponent ],
      providers: [ 
        {
          provide: WindowToken,
          useValue: window
        },
        { 
          provide: MAT_DIALOG_DATA, 
          useValue: {} 
        },
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ]
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
