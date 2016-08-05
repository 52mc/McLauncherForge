const debug = require('debug');
const logTypes = [ 'http', 'dom', 'debug', 'error' ];

var Log = {};
logTypes.forEach((type) => {
  Log[type] = debug(type);
});

module.exports = Log;
