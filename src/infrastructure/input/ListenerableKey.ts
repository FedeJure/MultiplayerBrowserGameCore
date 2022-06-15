import { Input } from "phaser";
import { Observable, Subject } from "rxjs";

export class ListenerableKey {
    private _onKeyDown = new Subject<void>() 
    readonly key: Phaser.Input.Keyboard.Key
    constructor(plugin: Input.Keyboard.KeyboardPlugin, code: number) {
        this.key = plugin.addKey(code)
        plugin.addListener(`keydown-${String.fromCharCode(code)}`, () => {
            this._onKeyDown.next()
        })
    }

    get onKeyDown(): Observable<void> {
        return this._onKeyDown
    }
}