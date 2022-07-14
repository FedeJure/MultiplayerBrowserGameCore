import { Input } from "phaser";
import { Observable, Subject } from "rxjs";

export class ListenerableKey {
    private _onKeyChange = new Subject<void>() 
    readonly key: Phaser.Input.Keyboard.Key
    constructor(plugin: Input.Keyboard.KeyboardPlugin, code: number) {
        this.key = plugin.addKey(code)
        this.key.addListener('down', () => this._onKeyChange.next())
        this.key.addListener('up', () => this._onKeyChange.next())
    }

    get onKeyChange(): Observable<void> {
        return this._onKeyChange
    }
}