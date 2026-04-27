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

    constructor(casparOsc) {
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

        this.#websocket.on("connection", this.#connectionHandler.bind(this));

        casparOsc.channelStatuses.forEach((status, channel) => {
            status.eventEmitter.on('update', this.#sendStatusUpdate.bind(this, channel, status));
        });
    }

    #status(req, res, next) {
        if (!/^\d+$/.test(req.params.channel)) {
            next();
            return;
        }

        Logger.debug(`Status page requested for channel ${req.params.channel}`);

        const channel = Config.channels[req.params.channel - 1];

        if (typeof channel === 'undefined') {
            res.status(404).send('Channel not found');
            return;
        }

        res.render('status', {
            name: channel.name,
            channel: `${channel.channel}-${channel.layer}`
        });
    }

    #connectionHandler(socket) {
        socket.on('subscribe', (topic) => {
            Logger.debug(`Joining topic: ${topic}`);
            socket.join(topic);
        });

        socket.on('unsubscribe', (topic) => {
            Logger.debug(`Leaving topic: ${topic}`);
            socket.leave(topic);
        });
    }

    #sendStatusUpdate(channel, status) {
        this.#websocket.to(channel).emit('current-time', status.currentTime);
        this.#websocket.to(channel).emit('remaining-time', status.remainingTime);
    }
}
