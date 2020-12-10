import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parsers from './parsers.js';

const readFile = (filePath) => {
  // const fullFilePath = path.resolve(process.cwd(), filePath);
  // const data = fs.readFileSync(fullFilePath).toString();
  // return data;
  try {
    return fs.readFileSync(filePath).toString();
  } catch (error) {
    throw new Error(error);
  }
};

const calculateDifference = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const allKeys = [...obj1Keys, ...obj2Keys];
  const allKeysSet = new Set(allKeys);
  const allUniqKeys = Array.from(allKeysSet);

  allUniqKeys.sort((a, b) => a.localeCompare(b, 'en'));

  const rows = allUniqKeys
    .reduce((acc, key) => {
      if (_.has(obj1, key) && _.has(obj2, key)) {
        const currentAcc = obj1[key] === obj2[key]
          ? [...acc, `    ${key}: ${obj1[key]}`]
          : [...acc, `  - ${key}: ${obj1[key]}`, `  + ${key}: ${obj2[key]}`];

        return currentAcc;
      }
      return _.has(obj1, key)
        ? [...acc, `  - ${key}: ${obj1[key]}`]
        : [...acc, `  + ${key}: ${obj2[key]}`];
    }, [])
    .join('\n');

  const resultString = `{\n${rows}\n}`;

  return resultString;
};

const getFileExtension = (filename) => {
  const [extension] = filename.match(/(?<=\w\.)\w+$/);
  return extension;
};

export default (fullPath1, fullPath2) => {
  const rawData1 = readFile(fullPath1);
  const rawData2 = readFile(fullPath2);

  const file1Extension = path.extname(fullPath1).slice(1);
  const file2Extension = path.extname(fullPath2).slice(1);

  const data1 = parsers[file1Extension](rawData1);
  const data2 = parsers[file2Extension](rawData2);

  return calculateDifference(data1, data2);
};
