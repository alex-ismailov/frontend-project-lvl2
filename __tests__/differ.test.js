/* eslint no-underscore-dangle: ["error", { "allow": ["__filename", "__dirname"] }] */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import noop from 'lodash/noop.js';
import differ from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8').trim();

let file1JsonPath;
let file2JsonPath;
let stylishDiffOfFile1AndFile2;

beforeAll(() => {
  file1JsonPath = getFixturePath('file1.json');
  file2JsonPath = getFixturePath('file2.json');
  stylishDiffOfFile1AndFile2 = readFile('stylishDiffOfFile1AndFile2.txt').trim();
});

describe.each([
  [getFixturePath('file1.json'), getFixturePath('file2.json'), readFile('stylishDiffOfFile1AndFile2.txt')],
  [getFixturePath('file1.json'), getFixturePath('file2.yaml'), readFile('stylishDiffOfFile1AndFile2.txt')],
  [getFixturePath('file1.yaml'), getFixturePath('file2.yaml'), readFile('stylishDiffOfFile1AndFile2.txt')],
  [getFixturePath('file1.json'), getFixturePath('fileEmpty.yaml'), readFile('stylishDiffOfFile1AndFileEmpty.txt')],
  [getFixturePath('fileEmpty.json'), getFixturePath('fileEmpty.yaml'), readFile('stylishDiffOfEmptyFiles.txt')],
])('Test diff of %s %s', (filepath1, filepath2, expected) => {
  test('Stylish output', () => {
    expect(differ(filepath1, filepath2)).toEqual(expected.trim());
  });
});

describe.each([
  [getFixturePath('file1.json'), getFixturePath('file2.json'), readFile('plainDiffOfFile1AndFile2.txt')],
  [getFixturePath('file1.json'), getFixturePath('file2.yaml'), readFile('plainDiffOfFile1AndFile2.txt')],
  [getFixturePath('file1.yaml'), getFixturePath('file2.yaml'), readFile('plainDiffOfFile1AndFile2.txt')],
  [getFixturePath('file1.json'), getFixturePath('fileEmpty.yaml'), readFile('plainDiffOfFile1AndFileEmpty.txt')],
  [getFixturePath('fileEmpty.json'), getFixturePath('fileEmpty.yaml'), readFile('plainDiffOfEmptyFiles.txt')],
])('Test diff of %s %s', (filepath1, filepath2, expected) => {
  test('Plain output', () => {
    expect(differ(filepath1, filepath2, 'plain')).toEqual(expected.trim());
  });
});

describe.each([
  [getFixturePath('file1.json'), getFixturePath('file2.json'), readFile('jsonDiffOfFile1AndFile2.txt')],
  [getFixturePath('file1.json'), getFixturePath('file2.yaml'), readFile('jsonDiffOfFile1AndFile2.txt')],
  [getFixturePath('file1.yaml'), getFixturePath('file2.yaml'), readFile('jsonDiffOfFile1AndFile2.txt')],
  [getFixturePath('file1.json'), getFixturePath('fileEmpty.yaml'), readFile('jsonDiffOfFile1AndFileEmpty.txt')],
  [getFixturePath('fileEmpty.json'), getFixturePath('fileEmpty.yaml'), readFile('jsonDiffOfEmptyFiles.txt')],
])('Test diff of %s %s', (filepath1, filepath2, expected) => {
  test('JSON output', () => {
    expect(differ(filepath1, filepath2, 'json')).toEqual(expected.trim());
  });
});

describe('Paths tests', () => {
  test('absolute paths', () => {
    expect(differ(file1JsonPath, file2JsonPath)).toEqual(stylishDiffOfFile1AndFile2);
  });

  test('relative paths', () => {
    const filepath1 = '__fixtures__/file1.json';
    const filepath2 = '__fixtures__/file2.json';
    expect(differ(filepath1, filepath2)).toEqual(stylishDiffOfFile1AndFile2);
  });
});

describe('Edge cases', () => {
  test('non-existent file', () => {
    const nonExistenPath = 'non-exist-file.json';
    expect(() => differ(nonExistenPath, nonExistenPath)).toThrow('ENOENT');
  });

  test('File path is undefined', () => {
    const filepath1 = noop();
    expect(() => differ(filepath1, file2JsonPath)).toThrow('argument must be of type string');
  });

  test('Non exist formatter style', () => {
    expect(() => differ(file1JsonPath, file2JsonPath, 'nonExistFormatterStyle')).toThrow('Unknown formatter type');
  });
});
