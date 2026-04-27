import { Server } from 'node-osc';
import ChannelStatus from './channel-status.js';
import Config from './config.js';
import Logger from './logger.js';

export default class CasparOsc {
    channelStatuses = new Map();

    #channels;
    #server;

    constructor(config) {
        Config.channels.forEach((channel) => {
            this.channelStatuses.set(`${channel.channel}-${channel.layer}`, new ChannelStatus());
        });

        this.#server = new Server(Config.oscPort, '0.0.0.0', () => {
            Logger.info(`CasparCG OSC server listening on port ${Config.oscPort}`);
        });

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
        let address = msg.address.split('/');
        let addressChannelIndex = address.findIndex('channel');
        let addressLayerIndex = address.findIndex('layer');

        let channel = addressChannelIndex !== -1 ? parseInt(address[addressChannelIndex + 1]) : Number.NaN;
        let layer = addressLayerIndex !== -1 ? parseInt(address[addressLayerIndex + 1]) : Number.NaN;

        if (isNaN(channel) || isNaN(layer) || !this.channelStatuses.has(`${channel}-${layer}`)) {
            return;
        }

        if (address[address.length - 2] !== 'file' && address[address.length - 1] !== 'time') {
            this.channelStatuses.get(`${channel}-${layer}`).updateTime(msg.args[0].value, msg.args[1].value);
        }
    }
}
