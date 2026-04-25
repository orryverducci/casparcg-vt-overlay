import { Server } from 'node-osc';
import Config from './config.js';
import Logger from './logger.js';

export default class CasparOsc {
    _server;

    constructor(config) {
        this._server = new Server(Config.oscPort, '0.0.0.0');
    }
}
