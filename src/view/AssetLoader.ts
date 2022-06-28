import { Scene } from "phaser";

export class AssetLoader {
  private static _baseUrl: string = "";
  static setBaseUrl(url: string) {
    this._baseUrl = url;
  }

  static resolveAssetPath(asset: string) {
    return `${this._baseUrl}${asset}`;
  }

  static get baseUrl() {
    return this._baseUrl
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
