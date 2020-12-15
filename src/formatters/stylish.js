import { isObject } from '../utils.js';

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

export default (ast) => {
  const formatterIter = (currAst, currIndent) => {
    const rows = currAst
      .reduce((acc, keyNode) => {
        const { type } = keyNode;
        return type === 'parent'
          ? [...acc, stringsMap[type](keyNode, currIndent, formatterIter)]
          : [...acc, ...stringsMap[type](keyNode, currIndent)];
      }, [])
      .join('\n');

    return `{\n${rows}\n${currIndent}}`;
  };

  return formatterIter(ast, '');
};
