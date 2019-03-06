"use strict";
exports.__esModule = true;
var PubSub_1 = require("../lib/PubSub");
var events_1 = require("../socket/events");
var LobbyRunner_1 = require("./LobbyRunner");
var LobbyManager = (function () {
    function LobbyManager() {
        var _this = this;
        this.lobbyRunners = [];
        this.createLobby = function (data) {
            var admin = data.player;
            var lobbyRunner = new LobbyRunner_1.LobbyRunner(admin);
            _this.lobbyRunners.push(lobbyRunner);
            _this.pubSub.publish(events_1.EVENTS.ADD_PLAYER_TO_NAMESPACE, {
                namespace: lobbyRunner.getLobby().token,
                player: data.player
            });
            _this.pubSub.publish(events_1.EVENTS.SERVER_TO_PLAYER, {
                event: "lobby created",
                payload: {
                    lobby: lobbyRunner.getLobby()
                },
                player: data.player
            });
        };
        this.pubSub = new PubSub_1["default"]();
        this.pubSub.subscribe(events_1.EVENTS.LOBBY_CREATE, this.createLobby);
    }
    return LobbyManager;
}());
exports.LobbyManager = LobbyManager;
//# sourceMappingURL=LobbyManager.js.map