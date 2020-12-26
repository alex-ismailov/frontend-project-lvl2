import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import differ from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8').trim();

const file1JsonPath = getFixturePath('file1.json');
const file2JsonPath = getFixturePath('file2.json');
const fileEmptyJsonPath = getFixturePath('fileEmpty.json');
const file1YamlPath = getFixturePath('file1.yaml');
const file2YamlPath = getFixturePath('file2.yaml');
const fileEmptyYamlPath = getFixturePath('fileEmpty.yaml');

const stylishDiffOfFile1AndFile2 = readFile('stylishDiffOfFile1AndFile2.txt').trim();
const stylishDiffOfFile1AndFileEmpty = readFile('stylishDiffOfFile1AndFileEmpty.txt').trim();
const stylishDiffOfEmptyFiles = readFile('stylishDiffOfEmptyFiles.txt').trim();

const plainDiffOfFile1AndFile2 = readFile('plainDiffOfFile1AndFile2.txt').trim();
const plainDiffOfFile1AndFileEmpty = readFile('plainDiffOfFile1AndFileEmpty.txt').trim();
const plainDiffOfEmptyFiles = readFile('plainDiffOfEmptyFiles.txt').trim();

const jsonDiffOfFile1AndFile2 = readFile('jsonDiffOfFile1AndFile2.txt').trim();
const jsonDiffOfFile1AndFileEmpty = readFile('jsonDiffOfFile1AndFileEmpty.txt').trim();
const jsonDiffOfEmptyFiles = readFile('jsonDiffOfEmptyFiles.txt').trim();

describe('Main flow', () => {
  test.each`
        filepath1        |     filepath2        | outputStyle |           expected
    ${file1JsonPath}     | ${file2JsonPath}     | ${undefined}   | ${stylishDiffOfFile1AndFile2}
    ${file1YamlPath}     | ${file2YamlPath}     | ${undefined}   | ${stylishDiffOfFile1AndFile2}
    ${file1JsonPath}     | ${file2YamlPath}     | ${undefined}   | ${stylishDiffOfFile1AndFile2}
    ${file1JsonPath}     | ${fileEmptyJsonPath} | ${undefined}   | ${stylishDiffOfFile1AndFileEmpty}
    ${fileEmptyJsonPath} | ${fileEmptyYamlPath} | ${undefined}   | ${stylishDiffOfEmptyFiles}
    ${file1JsonPath}     | ${file2JsonPath}     | ${'plain'}  | ${plainDiffOfFile1AndFile2}
    ${file1YamlPath}     | ${file2YamlPath}     | ${'plain'}  | ${plainDiffOfFile1AndFile2}
    ${file1JsonPath}     | ${file2YamlPath}     | ${'plain'}  | ${plainDiffOfFile1AndFile2}
    ${file1JsonPath}     | ${fileEmptyJsonPath} | ${'plain'}  | ${plainDiffOfFile1AndFileEmpty}
    ${fileEmptyJsonPath} | ${fileEmptyYamlPath} | ${'plain'}  | ${plainDiffOfEmptyFiles}
    ${file1JsonPath}     | ${file2JsonPath}     | ${'json'}   | ${jsonDiffOfFile1AndFile2}
    ${file1YamlPath}     | ${file2YamlPath}     | ${'json'}   | ${jsonDiffOfFile1AndFile2}
    ${file1JsonPath}     | ${file2YamlPath}     | ${'json'}   | ${jsonDiffOfFile1AndFile2}
    ${file1JsonPath}     | ${fileEmptyJsonPath} | ${'json'}   | ${jsonDiffOfFile1AndFileEmpty}
    ${fileEmptyJsonPath} | ${fileEmptyYamlPath} | ${'json'}   | ${jsonDiffOfEmptyFiles}
  `('Test diff of: $filepath1 and $filepath2', ({
    filepath1, filepath2, outputStyle, expected,
  }) => {
    /* This json result processing is necessary so that a person
    can check manually if there is an error in the fixtures.
    The minified json string is made readable. */
    const result = differ(filepath1, filepath2, outputStyle);
    const readableResult = outputStyle === 'json'
      ? JSON.stringify(JSON.parse(result), null, '  ')
      : result;
    expect(readableResult).toEqual(expected);
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
    const filepath1 = undefined;
    expect(() => differ(filepath1, file2JsonPath)).toThrow('argument must be of type string');
  });

  test('Non exist formatter style', () => {
    expect(() => differ(file1JsonPath, file2JsonPath, 'nonExistFormatterStyle')).toThrow('Unknown formatter type');
  });
});
