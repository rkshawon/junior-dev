"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = start;
exports.listen = listen;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _socket = require("socket.io");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/**
 * Initializes a Socket.IO server with the provided HTTP server instance,
 * options, and event handlers.
 *
 * @param {http.Server} server - The HTTP server instance to attach the
 *   Socket.IO server to.
 * @param {Object} events - An object that maps event names to handler
 *   functions and properties. The properties include any additional
 *   metadata that the handler functions might need to process the event.
 * @param {Object} options - An object containing any Socket.IO server options
 *   to configure the server instance. This can include things like the CORS
 *   configuration, whether to allow binary data, etc.
 * @returns {SocketIO.Server} - The initialized Socket.IO server instance.
 */
function start(server, options) {
  const io = new _socket.Server(server, {
    cors: {
      origin: options.origin,
      credentials: true,
      methods: ['GET', 'POST']
    }
  });
  console.log('=> Socket.io initialized');
  return io;
}

/**
 * Registers all the event handlers for the provided Socket.IO server
 * instance and attaches them to the appropriate events.
 *
 * @param {SocketIO.Server} io - The Socket.IO server instance to register
 *   the event handlers for.
 * @param {Object} events - An object that maps event names to handler
 *   functions and properties. The properties include any additional
 *   metadata that the handler functions might need to process the event.
 */
function listen(io, events) {
  io.on('connection', async ws => {
    console.log('Connected =>', ws.id);
    ws.on('disconnect', () => console.log('Diconnected =>', ws.id));
    ws.onAny((event, ...args) => {
      events[event]?.method(_objectSpread({
        data: args[0],
        session: ws
      }, events[event]?.props));
    });
  });
  console.log('=> Registered all event handlers');
}