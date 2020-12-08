import { fileURLToPath } from 'url';
import path from 'path';
import { promises as fs } from 'fs';

import differ from '../src/differ.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

});

});
