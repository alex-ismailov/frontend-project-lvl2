import _ from 'lodash';
import { isObject, getKeysUnion } from './utils.js';

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

const isObject = (value) => (
  value === null
    ? false
    : value.constructor.name === 'Object'
);

const actionPrefixMap = {
  same: '    ',
  added: '  + ',
  deleted: '  - ',
};

const makeStringFromObjEntries = (obj, indent) => {
  const iter = (currObj, currIndent) => {
    const keys = Object.keys(currObj);
    const res = keys.flatMap((key) => {
      if (isObject(currObj[key])) {
        return [
          `${currIndent}${actionPrefixMap.same}${key}: {`,
          ...iter(currObj[key], currIndent + ' '.repeat(4)),
          `${currIndent + ' '.repeat(4)}}`,
        ];
      }
      return `${currIndent}${actionPrefixMap.same}${key}: ${currObj[key]}`;
    });

    return res;
  };

  return `{\n${iter(obj, indent).join('\n')}\n${indent}}`;
};

const stringsMap = {
  same: (keyNode, indent) => [
    `${indent}${actionPrefixMap[keyNode.type]}${keyNode.name}: ${keyNode.value}`,
  ],
  changed: (keyNode, indent) => {
    if (isObject(keyNode.value)) {
      const nestedStructureStr = makeStringFromObjEntries(keyNode.value, indent + ' '.repeat(4));
      return [
        `${indent}${actionPrefixMap.deleted}${keyNode.name}: ${keyNode.prevValue}`,
        `${indent}${actionPrefixMap.added}${keyNode.name}: ${nestedStructureStr}`,
      ];
    }
    if (isObject(keyNode.prevValue)) {
      const nestedStructureStr = makeStringFromObjEntries(keyNode.prevValue, indent + ' '.repeat(4));
      return [
        `${indent}${actionPrefixMap.deleted}${keyNode.name}: ${nestedStructureStr}`,
        `${indent}${actionPrefixMap.added}${keyNode.name}: ${keyNode.value}`,
      ];
    }
    return [
      `${indent}${actionPrefixMap.deleted}${keyNode.name}: ${keyNode.prevValue}`,
      `${indent}${actionPrefixMap.added}${keyNode.name}: ${keyNode.value}`,
    ];
  },
  added: (keyNode, indent) => {
    if (isObject(keyNode.value)) {
      const nestedStructureStr = makeStringFromObjEntries(keyNode.value, indent + ' '.repeat(4));
      return [
        `${indent}${actionPrefixMap[keyNode.type]}${keyNode.name}: ${nestedStructureStr}`,
      ];
    }
    return [
      `${indent}${actionPrefixMap[keyNode.type]}${keyNode.name}: ${keyNode.value}`,
    ];
  },
  deleted: (keyNode, indent) => {
    if (isObject(keyNode.value)) {
      const nestedStructureStr = makeStringFromObjEntries(keyNode.value, indent + ' '.repeat(4));
      return [
        `${indent}${actionPrefixMap[keyNode.type]}${keyNode.name}: ${nestedStructureStr}`,
      ];
    }
    return [
      `${indent}${actionPrefixMap[keyNode.type]}${keyNode.name}: ${keyNode.value}`,
    ];
  },
  parent: (keyNode, indent, fn) => [
    `${indent}${actionPrefixMap.same}${keyNode.name}: ${fn(keyNode.children, indent + ' '.repeat(4))}`,
  ],
};

// Зачем reduce если тут можно просто map
const formatter = (ast) => {
  const formatterInner = (currAst, currIndent) => {
    const rows = currAst
      .reduce((acc, keyNode) => {
        const { type } = keyNode;
        return type === 'parent'
          ? [...acc, stringsMap[type](keyNode, currIndent, formatterInner)]
          : [...acc, ...stringsMap[type](keyNode, currIndent)];
      }, [])
      .join('\n');

    return `{\n${rows}\n${currIndent}}`;
  };

  return formatterInner(ast, '');
};

const getKeysUnion = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const allKeys = [...obj1Keys, ...obj2Keys];
  const allKeysSet = new Set(allKeys);

  return Array.from(allKeysSet);
};

const getObjsDifferenceAST = (obj1, obj2) => {
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
