"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionsRepository = void 0;
var rxjs_1 = require("rxjs");
var ConnectionsRepository = /** @class */ (function () {
    function ConnectionsRepository() {
        var _this = this;
        this.connections = new Array();
        this.onNewConnectionSubject = new rxjs_1.Subject();
        this.onDisconnectionSubject = new rxjs_1.Subject();
        this.onNewConnection = function () { return _this.onNewConnectionSubject; };
        this.onDisconnection = function () { return _this.onDisconnectionSubject; };
    }
    ConnectionsRepository.prototype.addConnection = function (connection) {
        this.connections.push(connection);
        this.onNewConnectionSubject.next(connection);
    };
    ConnectionsRepository.prototype.removeConnection = function (id) {
        var connection = this.connections.find(function (c) { return c.connectionId == id; });
        if (!connection) {
            console.log("[Connections Repository] Warning :: You are trying to remove a connection that not exists with id: " + id);
        }
        this.connections = this.connections.filter(function (c) { return c.connectionId != id; });
        this.onDisconnectionSubject.next(connection);
    };
    ConnectionsRepository.prototype.getAllConnections = function () {
        return this.connections;
    };
    return ConnectionsRepository;
}());
exports.ConnectionsRepository = ConnectionsRepository;
