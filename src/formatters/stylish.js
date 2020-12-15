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

const makeString = (indent, type, key, value) => {
  if (isObject(value)) {
    const nestedStructureStr = makeStringFromObjEntries(value, indent + ' '.repeat(4));
    return `${indent}${actionPrefixMap[type]}${key}: ${nestedStructureStr}`;
  }

  return `${indent}${actionPrefixMap[type]}${key}: ${value}`;
};

const stringsMap = {
  same: (keyNode, indent) => [
    makeString(indent, keyNode.type, keyNode.name, keyNode.value),
  ],
  changed: (keyNode, indent) => [
    makeString(indent, 'deleted', keyNode.name, keyNode.prevValue),
    makeString(indent, 'added', keyNode.name, keyNode.value),
  ],
  added: (keyNode, indent) => [
    makeString(indent, keyNode.type, keyNode.name, keyNode.value),
  ],
  deleted: (keyNode, indent) => [
    makeString(indent, keyNode.type, keyNode.name, keyNode.value),
  ],
  parent: (keyNode, indent, formatterIter) => {
    const value = formatterIter(keyNode.children, indent + ' '.repeat(4));
    return [
      makeString(indent, 'same', keyNode.name, value),
    ];
  },
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
