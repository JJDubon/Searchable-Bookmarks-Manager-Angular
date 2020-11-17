import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ApplicationSettings } from 'src/app/models/application-settings';
import { WindowToken } from 'src/window';
import { chromeExtensionBridgeTestService } from '../../tests/helpers/chrome-extension-bridge-test.service';
import { ChromeExtensionBridgeService } from '../chrome-extension-bridge/chrome-extension-bridge.service';
import { StorageService } from '../storage/storage.service';
import { ApplicationService } from './application.service';

describe('ApplicationService', () => {

  let service: ApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule
      ],
      providers: [
        {
          provide: WindowToken,
          useValue: window
        },
        {
          provide: DOCUMENT,
          useValue: { querySelector: () => {} }
        },
        {
          provide: ChromeExtensionBridgeService,
          useValue: chromeExtensionBridgeTestService
        }
      ]
    });
    service = TestBed.inject(ApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('can apply settings', async () => {
    
    const storageService = TestBed.inject(StorageService);
    const document = TestBed.inject(DOCUMENT);
    const fakeMainStyleObj = { style: { width: 'unset' } } as any;
    const fakeHtmlStyleObj = { style: { fontSize: 'unset' } } as any;

    const newSettings = new ApplicationSettings();
    newSettings.fontSize = 'regular';
    newSettings.pageWidth = 'regular';

    spyOn(document, 'querySelector')
      .withArgs('main').and.returnValue(fakeMainStyleObj)
      .withArgs('html').and.returnValue(fakeHtmlStyleObj);

    spyOn(storageService, 'getApplicationSettings').and.returnValue(of(newSettings));

    await service.applySettings().toPromise();
    expect(document.querySelector).toHaveBeenCalledWith('main');
    expect(document.querySelector).toHaveBeenCalledWith('html');
    expect(fakeMainStyleObj.style.width).toBe('400px');
    expect(fakeHtmlStyleObj.style.fontSize).toBe('11px');

  });


});
