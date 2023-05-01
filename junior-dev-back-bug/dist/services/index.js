"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.services = void 0;
var _bkash = _interopRequireDefault(require("./bkash/bkash"));
const services = app => {
  app.configure(_bkash.default);
};
exports.services = services;