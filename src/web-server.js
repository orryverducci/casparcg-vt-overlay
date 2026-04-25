import path from 'node:path';
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

        this.#websocket = new WebSocketServer({
            server: this.#server
        });

        this.#server.listen(Config.webServerPort, () => {
            Logger.info(`Web server running on port ${Config.webServerPort}`);
        });

        this.#server.use(express.static('public'));
        this.#server.use('/font', express.static(path.join('node_modules', '@fontsource', 'google-sans-code', 'files')));

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
