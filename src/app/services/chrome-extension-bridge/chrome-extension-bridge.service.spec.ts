import { TestBed } from '@angular/core/testing';

import { ChromeExtensionBridgeService } from './chrome-extension-bridge.service';

// Note: Intentionally not tested, this class should directly interface with the chrome api
// and exists solely to make testing other services easier.

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
