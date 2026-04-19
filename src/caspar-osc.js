import { Server } from 'node-osc';
import Logger from './logger.js';

export class CasparOsc {
    _server;

    constructor(config) {
        this._server = new Server(config.oscPort, '0.0.0.0');
    }
}
