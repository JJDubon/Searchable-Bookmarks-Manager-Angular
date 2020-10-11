import { ChromeExtensionBridgeService } from 'src/app/services/chrome-extension-bridge/chrome-extension-bridge.service';

export const chromeExtensionBridgeTestService = {};

Object.getOwnPropertyNames(ChromeExtensionBridgeService.prototype).forEach(prop => {
  if (prop !== 'constructor') {
    chromeExtensionBridgeTestService[prop] = () => {};
  }
});