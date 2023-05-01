"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NewMailer;
var _transport = _interopRequireDefault(require("./transport"));
function NewMailer(options) {
  const transport = new _transport.default(options);
  console.log('=> Mail service started!');

  /**
   * Sends Email
   * @param {reciever, subject, body, type} MessageObject
   * @returns
   */
  return async function sendMail({
    receiver,
    subject,
    body,
    type
  }) {
    var mailObject = {
      to: receiver,
      from: {
        name: '',
        //add name
        address: '' //add address
      },

      subject
    };
    if (type === 'text') {
      mailObject.text = body;
    } else if (type === 'html') {
      mailObject.html = body;
    }

    // Mail Sender
    try {
      let a = await transport.sendMail(mailObject);
      console.log(a);
      return true;
    } catch (e) {
      return e;
    }
  };
}