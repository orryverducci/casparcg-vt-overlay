import { Server } from 'node-osc';
import Config from './config.js';
import Logger from './logger.js';

export default class CasparOsc {
    #channels;
    #server;

    constructor(config) {
        this.#channels = Config.channels;

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

        // CasparCG sends time information on addresses in the format: /channel/1/stage/layer/1/file/time
        if (!msg.address.endsWith("/file/time")) {
            return;
        }

        let address = msg.address.split('/');
        let addressChannelIndex = address.findIndex('channel');
        let addressLayerIndex = address.findIndex('layer');

        let channel = addressChannelIndex !== -1 ? parseInt(address[addressChannelIndex + 1]) : Number.NaN;
        let layer = addressLayerIndex !== -1 ? parseInt(address[addressLayerIndex + 1]) : Number.NaN;

        if (isNaN(channel) || isNaN(layer) || !this.#channels.some(c => c.channel == channel && c.layer == layer)) {
            return;
        }

        const currentTime = msg.args[0].value; // Current seconds
        const totalTime = msg.args[1].value;   // Total seconds
    }
}
