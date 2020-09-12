// Models the settings the user can configure for this application
export class ApplicationSettings {
  public fontSize: 'regular' | 'large';
  public pageWidth: 'regular' | 'large' | 'extra large';
}

// Default to both a "regular" sized window and a "regular" page width
export const defaultAppSettings = new ApplicationSettings();
defaultAppSettings.fontSize = 'regular';
defaultAppSettings.pageWidth = 'regular'