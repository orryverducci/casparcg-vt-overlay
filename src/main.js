import fs from 'node:fs';
import path from 'node:path';
import CasparOsc from './caspar-osc.js';
import Logger from './logger.js';
import WebServer from './web-server.js';

// Start CasparCG OSC server
const casparOsc = new CasparOsc();

// Start web server
const webServer = new WebServer(casparOsc);
