"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NewTransport;
var _nodemailer = _interopRequireDefault(require("nodemailer"));
function NewTransport(options) {
  return _nodemailer.default.createTransport({
    host: options.SMTP_HOST,
    port: options.SMTP_PORT,
    auth: {
      user: options.SMTP_USER,
      pass: options.SMTP_PASSWORD
    }
  });
}