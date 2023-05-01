"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _express = _interopRequireWildcard(require("express"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _expressFormData = _interopRequireDefault(require("express-form-data"));
var _https = _interopRequireDefault(require("https"));
var _http = _interopRequireDefault(require("http"));
var _path = _interopRequireDefault(require("path"));
var _morgan = _interopRequireDefault(require("morgan"));
var _expressActuator = _interopRequireDefault(require("express-actuator"));
var _fs = require("fs");
var _cors = _interopRequireDefault(require("cors"));
var _hooks = require("./hooks");
var _services = require("./services");
var _socket = _interopRequireWildcard(require("./controllers/socket"));
var _search = _interopRequireDefault(require("./controllers/search/search"));
var _email = _interopRequireDefault(require("./controllers/email"));
var operations = _interopRequireWildcard(require("./controllers/operations"));
var _settings = _interopRequireDefault(require("../settings.json"));
var _imageUp = require("./controllers/imageUp");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
class App {
  constructor() {
    this.express = (0, _express.default)();
    this.router = new _express.Router();
    this.config = _settings.default;
    this.search = new _search.default();
    this.mail = (0, _email.default)(this.config);
    this.imageUp = _imageUp.imageUp;
    this.db = operations;
    this.events = {};

    // Boot Up the server & services
    this.init();
  }
  start() {
    this.listen();
  }
  init() {
    const {
      parse
    } = _expressFormData.default;
    this.express.enable('trust proxy');

    // Load the middlewwares
    this.express.use((0, _cors.default)({
      origin: this.config.origin,
      credentials: true
    }));
    this.express.use((0, _morgan.default)('common')); // Logger
    this.express.use((0, _expressActuator.default)({
      infoGitMode: 'full'
    })); // Health Checker
    this.express.use((0, _express.json)()); // Parse JSON response
    this.express.use((0, _express.urlencoded)({
      extended: false
    })); // Legacy URL encoding
    this.express.use((0, _cookieParser.default)()); // Parse cookies
    this.express.use(parse()); // Parse Form data as JSON
    this.express.use(_express.default.static(_path.default.resolve(__dirname, '..', 'client'))); // REACT build files (Statics)
    this.express.use('/api', this.router); // All the API routes

    if (this.config.useHTTP2) {
      // SSL configuration
      this.ssl = {
        key: (0, _fs.readFileSync)(_path.default.resolve('ssl', 'privatekey.pem')),
        cert: (0, _fs.readFileSync)(_path.default.resolve('ssl', 'certificate.pem'))
      };
      this.options = _objectSpread(_objectSpread({}, this.ssl), {}, {
        allowHTTP1: true
      });

      // Server
      this.server = _https.default.createServer(this.options, this.express);

      // Load the Hooks
      (0, _hooks.hooks)(this);
    } else {
      this.server = _http.default.createServer(this.express);
    }

    // Start Search service
    this.search.start();
    // Sokcet Server
    this.socket = (0, _socket.default)(this.server, {
      origin: this.config.origin
    });
    // Load the Services
    (0, _services.services)(this);

    // Listen for events
    (0, _socket.listen)(this.socket, this.events);
  }
  listen() {
    // Serve Front-end
    this.express.get('*', (req, res) => {
      res.sendFile(_path.default.resolve(__dirname, '..', 'client', 'index.html'));
    });

    // Boot the server
    this.server.listen(this.config.port, () => {
      console.log(`=> Listening on ${this.config.port}`);
    });
  }

  // Register Hooks
  hook(callback) {
    callback.call(_objectSpread({}, this));
  }

  // configure service with api
  configure(callback) {
    callback.call(_objectSpread(_objectSpread({}, this.express), {}, {
      route: this.router,
      ws: this.socket,
      imageUp: this.imageUp,
      lyra: this.search,
      db: this.db,
      mail: this.mail,
      config: this.config
    }));
  }

  // register events for ws with service
  register(event, callback) {
    this.events[event] = {
      method: callback,
      props: {
        ws: this.socket,
        lyra: this.search,
        db: this.db,
        mail: this.mail,
        config: this.config
      }
    };
  }
}
exports.default = App;