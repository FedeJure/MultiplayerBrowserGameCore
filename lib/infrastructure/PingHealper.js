"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var _onPing = new rxjs_1.Subject();
function onPing() {
    return _onPing;
}
