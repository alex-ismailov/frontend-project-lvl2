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

const file2YamlPath = getFixturePath('file2.yaml');
const file2YmlPath = getFixturePath('file2.yml');

const stylishDiffOfFile1AndFile2 = readFile('stylishDiffOfFile1AndFile2.txt');
const stylishDiffOfEmptyFiles = readFile('stylishDiffOfEmptyFiles.txt');

const plainDiffOfFile1AndFile2 = readFile('plainDiffOfFile1AndFile2.txt');
const plainDiffOfEmptyFiles = readFile('plainDiffOfEmptyFiles.txt');

const jsonDiffOfFile1AndFile2 = readFile('jsonDiffOfFile1AndFile2.json');
const jsonDiffOfEmptyFiles = readFile('jsonDiffOfEmptyFiles.json');

const file1TxtPath = getFixturePath('file1.txt');

describe('Main flow', () => {
  test.each`
        filepath1        |     filepath2        | outputStyle  |          expected
    ${file1JsonPath}     | ${file2JsonPath}     | ${undefined} | ${stylishDiffOfFile1AndFile2}
    ${file1JsonPath}     | ${file2YamlPath}     | ${'stylish'} | ${stylishDiffOfFile1AndFile2}
    ${file1JsonPath}     | ${file2YmlPath}      | ${'stylish'} | ${stylishDiffOfFile1AndFile2}
    ${fileEmptyJsonPath} | ${fileEmptyJsonPath} | ${'stylish'} | ${stylishDiffOfEmptyFiles}
    ${file1JsonPath}     | ${file2JsonPath}     | ${'plain'}   | ${plainDiffOfFile1AndFile2}
    ${fileEmptyJsonPath} | ${fileEmptyJsonPath} | ${'plain'}   | ${plainDiffOfEmptyFiles}
    ${file1JsonPath}     | ${file2JsonPath}     | ${'json'}    | ${jsonDiffOfFile1AndFile2}
    ${fileEmptyJsonPath} | ${fileEmptyJsonPath} | ${'json'}    | ${jsonDiffOfEmptyFiles}
  `('Output style: $outputStyle; Test diff of: $filepath1 and $filepath2', ({
    filepath1, filepath2, outputStyle, expected,
  }) => {
    /* result is stringified for clearer visual output when tests fail.
    The second benefit is that the fixtures are readable. */
    const result = differ(filepath1, filepath2, outputStyle);
    const readableResult = outputStyle === 'json'
      ? JSON.stringify(JSON.parse(result), null, '  ')
      : result;
    expect(readableResult).toEqual(expected);
  });
});

describe('Edge cases', () => {
  test.each`
          filepath1     |      filepath2      |     outputStyle    |            expected
    ${'non-exist-file'} | ${'non-exist-file'} | ${'stylish'}       | ${'ENOENT'}
    ${undefined}        | ${undefined}        | ${'stylish'}       | ${'argument must be of type string'}
    ${file1JsonPath}    | ${file2JsonPath}    | ${'nonExistStyle'} | ${'Unknown formatter type'}
    ${file1TxtPath}     | ${file2JsonPath}    | ${'stylish'}       | ${'Unknown data format'}
  `('Test diff of: $filepath1 and $filepath2', ({
    filepath1, filepath2, outputStyle, expected,
  }) => {
    expect(() => differ(filepath1, filepath2, outputStyle)).toThrow(expected);
  });
});
