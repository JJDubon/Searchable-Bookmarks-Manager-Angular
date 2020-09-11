import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationSettings, defaultAppSettings } from 'src/app/models/application-settings';
import { ChromeExtensionBridgeService } from '../chrome-extension-bridge/chrome-extension-bridge.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private chromeExtensionBridge: ChromeExtensionBridgeService) { }

  public getStoredData(): Observable<{ [key: string]: any }> {
    return this.chromeExtensionBridge.getLocal(null);
  }

  public getOpenByDefault(id: string): Observable<boolean> {
    const key = this.getOpenByDefaultKey(id);
    return this.chromeExtensionBridge.getLocal(key);
  }

  public getOpenByDefaultKey(id: string): string {
    return 'd_o_' + id;
  }

  public storeOpenByDefault(id: string): void {
    this.chromeExtensionBridge.storeLocal(this.getOpenByDefaultKey(id), true).subscribe();
  }

  public storeClosedByDefault(id: string): void {
    this.chromeExtensionBridge.storeLocal(this.getOpenByDefaultKey(id), false).subscribe();
  }

  public getApplicationSettings(): Observable<ApplicationSettings> {
    return this.chromeExtensionBridge.getLocal(null).pipe(map(settings => {
      let applicationSettings = defaultAppSettings;
      applicationSettings.fontSize = settings.fontSize ?? defaultAppSettings.fontSize;
      applicationSettings.pageWidth = settings.pageWidth ?? defaultAppSettings.pageWidth;
      return applicationSettings;
    }));
  }

  public setApplicationSettings(applicationSettings: ApplicationSettings): void {
    this.chromeExtensionBridge.storeLocal('fontSize', applicationSettings.fontSize).subscribe();
    this.chromeExtensionBridge.storeLocal('pageWidth', applicationSettings.pageWidth).subscribe();
  }

}
