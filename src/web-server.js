import express from 'express';
import { WebSocketServer } from 'ws';
import Config from './config.js';
import Logger from './logger.js';

export class WebServer {
    _server;
    _websocket;

    constructor() {
        this._server = express();
        this._server.set('view engine', 'ejs');
        this._server.use(express.static('public'));

        this._ws = new WebSocketServer({
            server: this._server
        });

        this._server.listen(Config.webServerPort, () => {
            Logger.info(`Web server running on port ${Config.webServerPort}`);
        });

        this._server.get('/', this.#index.bind(this));
    }

    #index(req, res) {
        res.render('index', {
            name: 'A'
        });
    }
}
