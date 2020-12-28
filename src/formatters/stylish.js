import isPlainObject from 'lodash/isPlainObject.js';

const actionPrefixMap = {
  unchanged: '    ',
  added: '  + ',
  removed: '  - ',
};

const buildStringFromObj = (obj, indent) => {
  const iter = (currObj, currIndent) => {
    const keys = Object.keys(currObj);
    const objString = keys.flatMap((key) => {
      if (isPlainObject(currObj[key])) {
        return [
          `${currIndent}${actionPrefixMap.unchanged}${key}: {`,
          ...iter(currObj[key], currIndent + ' '.repeat(4)),
          `${currIndent + ' '.repeat(4)}}`,
        ];
      }
      return `${currIndent}${actionPrefixMap.unchanged}${key}: ${currObj[key]}`;
    });

    return objString;
  };

  return `{\n${iter(obj, indent).join('\n')}\n${indent}}`;
};

const buildString = (indent, type, key, value) => {
  if (isPlainObject(value)) {
    const nestedStructureStr = buildStringFromObj(value, indent + ' '.repeat(4));
    return `${indent}${actionPrefixMap[type]}${key}: ${nestedStructureStr}`;
  }

  return `${indent}${actionPrefixMap[type]}${key}: ${value}`;
};

const stringsMap = {
  unchanged: (diffNode, indent) => buildString(indent, diffNode.type, diffNode.key, diffNode.value),
  updated: (diffNode, indent) => [
    buildString(indent, 'removed', diffNode.key, diffNode.valueBefore),
    buildString(indent, 'added', diffNode.key, diffNode.value),
  ],
  added: (diffNode, indent) => buildString(indent, diffNode.type, diffNode.key, diffNode.value),
  removed: (diffNode, indent) => buildString(indent, diffNode.type, diffNode.key, diffNode.value),
  nested: (diffNode, indent, format) => {
    const value = format(diffNode.children, indent + ' '.repeat(4));
    return buildString(indent, 'unchanged', diffNode.key, value);
  },
};

const format = (currDiffTree, currIndent) => {
  const rows = currDiffTree
    .flatMap((diffNode) => {
      const { type } = diffNode;
      return type === 'nested'
        ? stringsMap[type](diffNode, currIndent, format)
        : stringsMap[type](diffNode, currIndent);
    })
    .join('\n');

  return `{\n${rows}\n${currIndent}}`;
};

export default (diffTree) => format(diffTree.children, '');
