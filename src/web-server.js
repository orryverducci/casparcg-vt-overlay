import express from 'express';
import { WebSocketServer } from 'ws';
import Config from './config.js';
import Logger from './logger.js';

export default class WebServer {
    #server;
    #websocket;

    constructor() {
        this.#server = express();
        this.#server.set('view engine', 'ejs');
        this.#server.use(express.static('public'));

        this.#websocket = new WebSocketServer({
            server: this.#server
        });

        this.#server.listen(Config.webServerPort, () => {
            Logger.info(`Web server running on port ${Config.webServerPort}`);
        });

        this.#server.get('/:channel', this.#status.bind(this));
    }

    #status(req, res) {
        Logger.debug(`Status page requested for channel ${req.params.channel}`);

        const channel = Config.channels[req.params.channel - 1];

        if (typeof channel === 'undefined') {
            res.status(404).send('Channel not found');
            return;
        }

        res.render('index', {
            name: channel.name
        });
    }
}
