(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var highlandProc = require('highland-process');

  var Command = require('./command/Command');

  var Tabula =
  /*#__PURE__*/
  function () {
    function Tabula(pdfPath, options) {
      _classCallCheck(this, Tabula);

      this._pdfPath = pdfPath;
      this._options = options;
    }

    _createClass(Tabula, [{
      key: "streamCsv",
      value: function streamCsv() {
        return highlandProc.from(new Command(this._pdfPath, this._options)).run();
      }
    }, {
      key: "extractStreamCsv",
      value: function extractStreamCsv(callback) {
        this.streamCsv().map(function (data) {
          return data.toString();
        }).split().collect().stopOnError(function (err) {
          return callback(err, null);
        }).each(function (data) {
          return callback(null, data);
        });
      }
    }, {
      key: "extractCsv",
      value: function extractCsv() {
        var cmd = new Command(this._pdfPath, this._options);
        var result = cmd.runSync();
        var stdout = result.stdout,
            stderr = result.stderr; // TODO Check status/signal/error

        return {
          output: stdout.toString(),
          error: stderr.toString()
        };
      }
    }], [{
      key: "fromPath",
      value: function fromPath(pdfPath, options) {
        return new Tabula(pdfPath, options);
      }
    }]);

    return Tabula;
  }();

  module.exports = Tabula;

}));
