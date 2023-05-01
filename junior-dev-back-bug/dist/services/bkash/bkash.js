"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bkash;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _bkash = require("./bkash.entity");
var _bkash2 = _interopRequireDefault(require("./bkash.functions"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
async function bkash() {
  const {
    username,
    password,
    appKey,
    appSecret,
    isSandbox
  } = this.config.bkash;
  const bkash = await _bkash2.default.init(username, password, appKey, appSecret, isSandbox);

  // Routes
  this.route.post('/bkash/createPayment'), (0, _bkash.createPayment)(_objectSpread(_objectSpread({}, this), {}, {
    bkash
  }));
  this.route.get('/bkash/execute', (0, _bkash.executePayment)(_objectSpread(_objectSpread({}, this), {}, {
    bkash
  })));
  this.route.get('/bkash/status', (0, _bkash.status)(_objectSpread(_objectSpread({}, this), {}, {
    bkash
  })));
}