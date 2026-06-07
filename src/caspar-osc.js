import osc from 'osc';
import ChannelStatus from './channel-status.js';
import Config from './config.js';
import Logger from './logger.js';

export default class CasparOsc {
    channelStatuses = new Map();

    #channels;
    #server;

    constructor() {
        Config.channels.forEach((channel) => {
            this.channelStatuses.set(`${channel.channel}-${channel.layer}`, new ChannelStatus());
        });

        this.#server = new osc.UDPPort({
            localAddress: "0.0.0.0",
            localPort: Config.oscPort,
            metadata: true
        });
        this.#server.open();

        this.#server.on('ready', this.serverReady.bind(this));
        this.#server.on('message', this.processMessage.bind(this));
        this.#server.on('bundle', this.processBundle.bind(this));
        this.#server.on('error', this.logError.bind(this));
    }

    serverReady() {
        Logger.info(`CasparCG OSC server listening on port ${Config.oscPort}`);
    }

    processBundle(bundle, timeTag, info) {
        bundle.packets.forEach((msg) => {
            this.processMessage(msg, timeTag, info);
        });
    }

    processMessage(msg, timeTag, info) {
        // CasparCG sends time information on addresses in the format: /channel/1/stage/layer/1/foreground/file/time
        let address = msg.address.split('/');
        let addressChannelIndex = address.findIndex((e) => e === 'channel');
        let addressLayerIndex = address.findIndex((e) => e === 'layer');

        let channel = addressChannelIndex !== -1 ? parseInt(address[addressChannelIndex + 1]) : Number.NaN;
        let layer = addressLayerIndex !== -1 ? parseInt(address[addressLayerIndex + 1]) : Number.NaN;

        if (isNaN(channel) || isNaN(layer) || !this.channelStatuses.has(`${channel}-${layer}`)) {
            return;
        }

        if (address[address.length - 2] === 'file' && address[address.length - 1] === 'time') {
            this.channelStatuses.get(`${channel}-${layer}`).updateTime(msg.args[0].value, msg.args[1].value);
        } else if (address[address.length - 3] === 'streams' && address[address.length - 2] === '0' && address[address.length - 1] === 'fps') {
            this.channelStatuses.get(`${channel}-${layer}`).updateFrameRate(msg.args[0].value, msg.args[1].value);
        } else if (address[address.length - 2] === 'file' && address[address.length - 1] === 'name') {
            this.channelStatuses.get(`${channel}-${layer}`).updateName(msg.args[0].value);
        }
    }

    logError(err) {
        Logger.error(`Error processing OSC message: ${err}`);
    }
}
