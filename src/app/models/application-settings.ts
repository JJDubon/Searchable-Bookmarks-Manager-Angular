export class ApplicationSettings {
  public fontSize: 'regular' | 'large';
  public pageWidth: 'regular' | 'large' | 'extra large';
}

export const defaultAppSettings = new ApplicationSettings();
defaultAppSettings.fontSize = 'regular';
defaultAppSettings.pageWidth = 'regular'