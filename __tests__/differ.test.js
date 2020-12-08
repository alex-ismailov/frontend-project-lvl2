import { fileURLToPath } from 'url';
import path from 'path';
import { promises as fs } from 'fs';

import differ from '../src/differ.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

});

test('test absolute paths', async () => {
  const filepath1 = '/home/smile/code/frontend-project-lvl2/__fixtures__/file1.json';
  const filepath2 = '/home/smile/code/frontend-project-lvl2/__fixtures__/file2.json';
  const expectedString = await readFile('twoJsonDiff.txt');
  expect(differ(filepath1, filepath2)).toEqual(expectedString.trim());
});
