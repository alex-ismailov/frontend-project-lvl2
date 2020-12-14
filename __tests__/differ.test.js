import { fileURLToPath } from 'url';
import path from 'path';
import { promises as fs } from 'fs';

import differ from '../src/differ.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFile(getFixturePath(filename), 'utf-8');

describe('Main flow', () => {
  test('Filled JSON files difference', async () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const expectedResult = await readFile('diff-file1-file2.txt');
    expect(differ(filepath1, filepath2)).toEqual(expectedResult.trim());
  });
  test('Filled JSON and YAML files difference', async () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.yaml');
    const expectedResult = await readFile('diff-file1-file2.txt');
    expect(differ(filepath1, filepath2)).toEqual(expectedResult.trim());
  });
  test('Filled and empty files difference', async () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const expectedResult = await readFile('diff-file1-file2.txt');
    expect(differ(filepath1, filepath2)).toEqual(expectedResult.trim());
  });
  test('Empty files difference', async () => {
    const filepath1 = getFixturePath('fileEmpty.json');
    const filepath2 = getFixturePath('fileEmpty.yaml');
    const expectedResult = await readFile('diff-emptyFiles.txt');
    expect(differ(filepath1, filepath2)).toEqual(expectedResult.trim());
  });
});

describe('Paths tests', () => {
  test('absolute paths', async () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const expectedString = await readFile('diff-file1-file2.txt');
    expect(differ(filepath1, filepath2)).toEqual(expectedString.trim());
  });

  test('relative paths', async () => {
    const filepath1 = '__fixtures__/file1.json';
    const filepath2 = '__fixtures__/file2.json';
    const expectedString = await readFile('diff-file1-file2.txt');
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
