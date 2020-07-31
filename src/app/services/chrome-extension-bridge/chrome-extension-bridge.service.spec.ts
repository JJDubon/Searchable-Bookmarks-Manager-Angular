import { TestBed } from '@angular/core/testing';

import { ChromeExtensionBridgeService } from './chrome-extension-bridge.service';

describe('ChromeExtensionBridgeService', () => {
  let service: ChromeExtensionBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChromeExtensionBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
