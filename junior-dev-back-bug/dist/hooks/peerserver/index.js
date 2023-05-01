"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _peer = require("peer");
function _default() {
  // Peer Server
  this.peer = (0, _peer.ExpressPeerServer)(this.server, {
    ssl: this.ssl,
    debug: true,
    path: '/',
    proxied: true
  });
  this.express.use('/peerserver', this.peer);
  console.log('=> Peer Server Started!');
}