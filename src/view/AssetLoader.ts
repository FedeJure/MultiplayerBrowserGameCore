export class AssetLoader {
  private static baseUrl: string = "";
  static setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  static resolveAssetPath(asset: string) {
    return `${this.baseUrl}${asset}`;
  }

  static resolveSpineConfig(texture: string): {
    key: string;
    jsonUrl: string;
    atlasUrl: string;
  } {
    return {
      key: texture,
      jsonUrl: this.resolveAssetPath(`${texture}.json`),
      atlasUrl: this.resolveAssetPath(`${texture}.atlas`),
    };
  }
}
