import path from 'node:path';
import { createServer } from 'node:http';
import express from 'express';
import { Server } from 'socket.io';
import Config from './config.js';
import Logger from './logger.js';

export default class WebServer {
    #app;
    #server;
    #websocket;

    constructor() {
        this.#app = express();
        this.#app.set('view engine', 'ejs');

        this.#server = createServer(this.#app);
        this.#websocket = new Server(this.#server);

        this.#server.listen(Config.webServerPort, () => {
            Logger.info(`Web server running on port ${Config.webServerPort}`);
        });

        this.#app.use('/assets', express.static('public'));
        this.#app.use('/assets', express.static(path.join('node_modules', '@fontsource', 'google-sans-code', 'files')));
        this.#app.use('/assets', express.static(path.join('node_modules', 'socket.io', 'client-dist')));

        this.#app.get('/:channel', this.#status.bind(this));
    }

    #status(req, res) {
        Logger.debug(`Status page requested for channel ${req.params.channel}`);

        const channel = Config.channels[req.params.channel - 1];

        if (typeof channel === 'undefined') {
            res.status(404).send('Channel not found');
            return;
        }

        res.render('status', {
            name: channel.name,
            channelID: req.params.channel
        });
    }
}
