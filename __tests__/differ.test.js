import { fileURLToPath } from 'url';
import path from 'path';
import { promises as fs } from 'fs';

import differ from '../src/differ.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

describe('Main flow with two json files', () => {
  test('two filled files', async () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const expectedString = await readFile('fille1JSON-fille2JSON.txt');
    expect(differ(filepath1, filepath2)).toEqual(expectedString.trim());
  });

  test('filled file with empty file', async () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file3Empty.json');
    const expectedString = await readFile('fille1JSON-file3EmptyJSON.txt');
    expect(differ(filepath1, filepath2)).toEqual(expectedString.trim());
  });

  test('empty file with filled file', async () => {
    const filepath1 = getFixturePath('file3Empty.json');
    const filepath2 = getFixturePath('file1.json');
    const expectedString = await readFile('file3Empty-file1JSON.txt');
    expect(differ(filepath1, filepath2)).toEqual(expectedString.trim());
  });

  test('two empty files', async () => {
    const filepath1 = getFixturePath('file3Empty.json');
    const filepath2 = getFixturePath('file3Empty.json');
    const expectedString = await readFile('file3EmptyJSON-file3EmptyJSON.txt');
    expect(differ(filepath1, filepath2)).toEqual(expectedString.trim());
  });
});

describe('Paths tests', () => {
  test('absolute paths', async () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const expectedString = await readFile('fille1JSON-fille2JSON.txt');
    expect(differ(filepath1, filepath2)).toEqual(expectedString.trim());
  });

  test('relative paths', async () => {
    const filepath1 = '__fixtures__/file1.json';
    const filepath2 = '__fixtures__/file2.json';
    const expectedString = await readFile('fille1JSON-fille2JSON.txt');
    expect(differ(filepath1, filepath2)).toEqual(expectedString.trim());
  });
});

describe('Edge cases', () => {
  test('non-existent file', async () => {
    const nonExistenPath = 'non-exist-file.json';
    const filepath2 = getFixturePath('file2.json');
    expect(() => differ(nonExistenPath, filepath2)).toThrow();
  });
});
