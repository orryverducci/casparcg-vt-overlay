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

        this.#server.get('/', this.#index.bind(this));
    }

    #index(req, res) {
        res.render('index', {
            name: 'A'
        });
    }
}
