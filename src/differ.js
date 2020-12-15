import _ from 'lodash';
import { isObject, getKeysUnion } from './utils.js';

  const keysUnion = getKeysUnion(obj1, obj2);
  keysUnion.sort((a, b) => a.localeCompare(b, 'en'));

  // ast представляет из себя массив узлов.
  // Узел описывает разницу между значениями по одноименным ключам в сравниваемых объектах.
  // Если ключ встречается только в одном из объектов, то узел помечается соответсвующим образом.
  // Если текущие значения (оба) по ключу являются объектами, то
  // ast вычисляется рекурсивно.
  return keysUnion
    .reduce((acc, key) => {
      if (_.has(obj1, key) && _.has(obj2, key)) {
        if (obj1[key] instanceof Object && obj2[key] instanceof Object) {
          return [...acc, { name: key, type: 'parent', children: [...getObjsDifferenceAST(obj1[key], obj2[key])] }];
        }

        const currentAcc = obj1[key] === obj2[key]
          ? [...acc, { name: key, type: 'same', value: obj1[key] }]
          : [...acc, {
            name: key, type: 'changed', value: obj2[key], prevValue: obj1[key],
          }];

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

  const ast = getObjsDifferenceAST(data1, data2);

  return formatter(ast);
};
