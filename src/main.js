import fs from 'node:fs';
import path from 'node:path';
import { CasparOsc } from './caspar-osc.js';
import Logger from './logger.js';
import { WebServer } from './web-server.js';

// Load config
const configFile = path.resolve(path.join('.', 'config', 'config.json'));

Logger.info(`Loading config from ${configFile}`);
const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

// Start CasparCG OSC server
const casparOsc = new CasparOsc(config);

// Start web server
const webServer = new WebServer(config);
