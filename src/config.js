import { parse } from 'yaml';
import fs from 'node:fs';
import path from 'node:path';
import Logger from './logger.js';

class Config {
    channels = [];
    oscPort = 6250;
    webServerPort = 3000;

    constructor() {
        let configFile = path.join(import.meta.dirname, '..', 'config', 'config.yaml');

        Logger.info(`Loading config from ${configFile}`);

        if (!fs.existsSync(configFile)) {
            Logger.warn(`Config file not found - using default config`);
            return;
        }

        try {
            let config = parse(fs.readFileSync(configFile, 'utf8'));

            this.channels = typeof config.channels !== 'undefined' ? config.channels : this.channels;
            this.oscPort = typeof config.oscPort !== 'undefined' ? config.oscPort : this.oscPort;
            this.webServerPort = typeof config.webServerPort !== 'undefined' ? config.webServerPort : this.webServerPort;
        } catch (err) {
            Logger.error(`Unable to parse config file (${err}) - using default config`);
        }
    }
}

export default new Config();
