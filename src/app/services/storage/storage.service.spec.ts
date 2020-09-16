import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApplicationSettings } from 'src/app/models/application-settings';
import { chromeExtensionBridgeTestService } from '../../tests/helpers/chrome-extension-bridge-test.service';
import { ChromeExtensionBridgeService } from '../chrome-extension-bridge/chrome-extension-bridge.service';
import { StorageService } from './storage.service';

describe('StorageService', () => {

  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ChromeExtensionBridgeService,
          useValue: chromeExtensionBridgeTestService
        }
      ]
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve stored data from the extension service', () => {

    const fakeStorageObs = of({});
    const chromeExtensionBridge = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(chromeExtensionBridge, 'getLocal').and.callFake(() => fakeStorageObs);

    const obs = service.getStoredData();
    expect(obs).toEqual(fakeStorageObs);
    expect(chromeExtensionBridge.getLocal).toHaveBeenCalledWith(null);

  });

  it('should retrieve the "open by default" value from the extension service', async () => {

    const fakeStorageObs = of(true);
    const chromeExtensionBridge = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(chromeExtensionBridge, 'getLocal').and.callFake(() => fakeStorageObs);

    const obs = service.getOpenByDefault('1');
    expect(obs).toEqual(fakeStorageObs);
    expect(chromeExtensionBridge.getLocal).toHaveBeenCalledWith('d_o_1');

  });

  it('should append a unique prefix when generating an open by default key', () => {

    const result = service.getOpenByDefaultKey('1');
    expect(result).toBe('d_o_1');

  });

  it('should store "true" when told to open a folder by default', () => {

    const fakeStorageObs = of(null);
    const chromeExtensionBridge = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(chromeExtensionBridge, 'storeLocal').and.callFake(() => fakeStorageObs);

    const obs = service.storeOpenByDefault('1');
    expect(obs).toEqual(fakeStorageObs);
    expect(chromeExtensionBridge.storeLocal).toHaveBeenCalledWith('d_o_1', true);

  });

  it('should store "false" when told to close a folder by default', () => {

    const fakeStorageObs = of(null);
    const chromeExtensionBridge = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(chromeExtensionBridge, 'storeLocal').and.callFake(() => fakeStorageObs);

    const obs = service.storeClosedByDefault('1');
    expect(obs).toEqual(fakeStorageObs);
    expect(chromeExtensionBridge.storeLocal).toHaveBeenCalledWith('d_o_1', false);

  });

  it('can retrieve settings from storage', async () => {

    const fakeStorageObs = of({
      fontSize: 'regular',
      pageWidth: 'regular'
    });

    const chromeExtensionBridge = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(chromeExtensionBridge, 'getLocal').and.callFake(() => fakeStorageObs);

    const obs = service.getApplicationSettings();
    const settings = await obs.toPromise();

    expect(settings.fontSize).toBe('regular');
    expect(settings.pageWidth).toBe('regular');

  });

  it('can set settings in storage', async () => {

    const chromeExtensionBridge = TestBed.inject(ChromeExtensionBridgeService);
    spyOn(chromeExtensionBridge, 'storeLocal').and.callFake(() => of(null));

    const settings = new ApplicationSettings();
    settings.fontSize = 'regular';
    settings.pageWidth = 'regular';

    await service.setApplicationSettings(settings).toPromise();
    expect(chromeExtensionBridge.storeLocal).toHaveBeenCalledWith('fontSize', settings.fontSize);
    expect(chromeExtensionBridge.storeLocal).toHaveBeenCalledWith('pageWidth', settings.pageWidth);

  });

});
