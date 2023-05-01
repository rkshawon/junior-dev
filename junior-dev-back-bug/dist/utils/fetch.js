"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;
var _axios = _interopRequireDefault(require("axios"));
async function fetch({
  method,
  url,
  headers,
  data
}) {
  try {
    return (await (0, _axios.default)({
      url,
      method,
      headers,
      data
    }))?.data;
  } catch (e) {
    throw new Error(e?.message);
  }
}