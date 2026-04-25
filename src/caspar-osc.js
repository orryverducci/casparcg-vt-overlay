import { Server } from 'node-osc';
import Config from './config.js';
import Logger from './logger.js';

export default class CasparOsc {
    #server;

    constructor(config) {
        this.#server = new Server(Config.oscPort, '0.0.0.0');

        this.#server.on('message', this.processMessage.bind(this));
        this.#server.on('bundle', this.processBundle.bind(this));
    }

    processBundle(bundle) {
        Logger.debug('OSC bundle received');

        bundle.elements.forEach((msg) => {
            this.processMessage(msg).bind(this);
        });
    }

    processMessage(msg) {
        Logger.debug(`OSC message received: ${msg}`);
    }
}
