import { logFactory } from 'pretty-js-log';

class Logger {
    _logger;

    constructor() {
        this._logger = logFactory({});
    }

    info(message) {
        this._logger.info(message);
    }

    warn(message) {
        this._logger.warn(message);
    }

    error(message) {
        this._logger.error(message);
    }

    debug(message) {
        this._logger.debug(message);
    }
}

export default new Logger();
