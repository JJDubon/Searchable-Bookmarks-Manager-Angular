import { ChromeExtensionBridgeService } from './chrome-extension-bridge.service';

export const chromeExtensionBridgeTestService = {};

Object.getOwnPropertyNames(ChromeExtensionBridgeService.prototype).forEach(prop => {
  if (prop !== 'constructor') {
    chromeExtensionBridgeTestService[prop] = () => {};
  }
});