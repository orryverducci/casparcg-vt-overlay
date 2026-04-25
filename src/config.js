import { parse } from 'yaml';
import fs from 'node:fs';
import path from 'node:path';
import Logger from './logger.js';

class Config {
    channels = {};
    oscPort = 6250;
    webServerPort = 3000;

    constructor() {
        let configFile = path.resolve(path.join('.', 'config', 'config.yaml'));

        Logger.info(`Loading config from ${configFile}`);

        if (!fs.existsSync(configFile)) {
            Logger.error(`Config file not found - using default config`);
            return;
        }

        try {
            let config = parse(fs.readFileSync(configFile, 'utf8'));

            this.channels = typeof config.channels !== 'undefined' ? config.channels : this.channels;
            this.oscPort = typeof config.oscPort !== 'undefined' ? config.oscPort : this.channels;
            this.webServerPort = typeof config.webServerPort !== 'undefined' ? config.webServerPort : this.channels;
        } catch (err) {
            Logger.error(`Unable to parse config file (${err}) - using default config`);
        }
    }
}

export default new Config();
