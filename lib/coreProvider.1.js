"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
var Provider = /** @class */ (function () {
    function Provider() {
    }
    Provider.ServierInit = function (connections, playerInfos, playerStates, presenterProvider) {
        Provider._connectionsRepository = connections;
        Provider._playerInfoRepository = playerInfos;
        Provider._playerStateRepository = playerStates;
        Provider._presenterProvider = presenterProvider;
    };
    Provider.ClientInit = function (presenterProvider, serverConnection) {
        Provider._presenterProvider = presenterProvider;
        Provider._serverConnection = serverConnection;
    };
    Object.defineProperty(Provider, "connectionsRepository", {
        get: function () { return Provider._connectionsRepository; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Provider, "playerInfoRepository", {
        get: function () { return Provider._playerInfoRepository; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Provider, "playerStateRepository", {
        get: function () { return Provider._playerStateRepository; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Provider, "presenterProvider", {
        get: function () { return Provider._presenterProvider; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Provider, "serverConnection", {
        get: function () { return Provider._serverConnection; },
        enumerable: false,
        configurable: true
    });
    return Provider;
}());
exports.Provider = Provider;
