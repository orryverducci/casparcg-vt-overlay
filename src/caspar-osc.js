import { Server } from 'node-osc';
import Config from './config.js';
import Logger from './logger.js';

export default class CasparOsc {
    #server;

    constructor(config) {
        this.#server = new Server(Config.oscPort, '0.0.0.0');
    }
}
