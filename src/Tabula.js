const highlandProc = require('highland-process');
const Command = require('./Command');

class Tabula {
  constructor(pdfPath, options) {
    this._pdfPath = pdfPath;
    this._options = options;
  }

  _makeCommand() {
    return new Command(this._pdfPath, this._options);
  }

  getCsvStream() {
    return highlandProc
      .from(this._makeCommand())
      .run();
  }

  getCsvStreamData(errCb, dataCb) {
    this.getCsvStream()
        .map(data => data.toString())
        .split()
        .collect()
        .stopOnError(errCb)
        .each(dataCb);
  }

  getCsv() {
    const {
      stdout,
      stderr,
    } = this._makeCommand().runSync();

    // TODO Check status/signal/error
    return {
      output: stdout.toString(),
      error: stderr.toString(),
    };
  }
}

module.exports = Tabula;
