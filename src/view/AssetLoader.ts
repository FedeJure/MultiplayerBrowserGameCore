
export class AssetLoader {
    private static baseUrl: string = ''
    static setBaseUrl(url: string) {
        this.baseUrl = url
    }

    static resolveAssetPath(asset: string) {
        return `${this.baseUrl}${asset}`
    }
}