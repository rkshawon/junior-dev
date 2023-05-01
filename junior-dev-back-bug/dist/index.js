"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _mongodb = _interopRequireDefault(require("./controllers/mongodb"));
var _app = _interopRequireDefault(require("./app"));
var _settings = _interopRequireDefault(require("../settings.json"));
// eslint-disable-next-line
console.log(`\x1b[31m
BRAKING CHANGE!!!
From now on all the API endpoints will be prefixed as /api
You won't need to change the server code but the front end.

HTTP methods should be used as this.route.METHOD
rather than this.METHOD

The previous way will keep working but will not be served as endpoint
\x1b[0m`);
(() => {
  // Check for clients directory as it is required by this framework
  const statics = _path.default.resolve(__dirname, '..', 'client');
  if (!_fs.default.existsSync(statics)) {
    _fs.default.mkdirSync(statics);
  }

  // Connect to MongoDB
  (0, _mongodb.default)(_settings.default.mongodbURL).then(function (res) {
    console.log(`=> ${res}!`);

    // Boot Up the server & services
    const app = new _app.default();
    app.start();
  }).catch(err => console.log(err));
})();