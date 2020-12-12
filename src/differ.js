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

  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const allKeys = [...obj1Keys, ...obj2Keys];
  const allKeysSet = new Set(allKeys);
  const allUniqKeys = Array.from(allKeysSet);

  allUniqKeys.sort((a, b) => a.localeCompare(b, 'en'));

const getObjsDifferenceAST = (obj1, obj2) => {
  const keysUnion = getKeysUnion(obj1, obj2);
  keysUnion.sort((a, b) => a.localeCompare(b, 'en'));

  // ast представляет из себя массив узлов. Узел описывает св-ва отдельного взятого ключа из
  // объединения множеств ключей двух объектов. Если два текущих св-ва на проверке являются объектами, то
  // ast вычисляется рекурсивно.
  return keysUnion
    .reduce((acc, key) => {
      if (_.has(obj1, key) && _.has(obj2, key)) {
        if (obj1[key] instanceof Object && obj2[key] instanceof Object) {
          return [...acc, { name: key, type: 'parent', children: [...getObjsDifferenceAST(obj1[key], obj2[key])]}];
        }

        const currentAcc = obj1[key] === obj2[key]
          ? [...acc, { name: key, type: 'same', value: obj1[key] }]
          : [...acc, { name: key, type: 'changed', value: obj2[key], prevValue: obj1[key] }];

        return currentAcc;
      }

      return _.has(obj1, key)
        ? [...acc, { name: key, type: 'deleted', value: obj1[key] }]
        : [...acc, { name: key, type: 'added', value: obj2[key] }];
    }, []);
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
