"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = void 0;
var _peerserver = _interopRequireDefault(require("./peerserver"));
const hooks = app => {
  app.hook(_peerserver.default);
};
exports.hooks = hooks;