import isPlainObject from 'lodash/isPlainObject.js';

const actionPrefixMap = {
  unchanged: '    ',
  added: '  + ',
  removed: '  - ',
};

const buildStringRows = (obj, indent) => {
  const keys = Object.keys(obj);
  const objString = keys.flatMap((key) => {
    if (isPlainObject(obj[key])) {
      return [
        `${indent}${actionPrefixMap.unchanged}${key}: {`,
        ...buildStringRows(obj[key], indent + ' '.repeat(4)),
        `${indent + ' '.repeat(4)}}`,
      ];
    }
    return `${indent}${actionPrefixMap.unchanged}${key}: ${obj[key]}`;
  });

  return objString;
};

const buildStringFromObj = (obj, indent) => (
  `{\n${buildStringRows(obj, indent).join('\n')}\n${indent}}`
);

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

const format = (currDiffTree, indent) => {
  const rows = currDiffTree
    .flatMap((diffNode) => {
      const { type } = diffNode;
      return type === 'nested'
        ? stringsMap[type](diffNode, indent, format)
        : stringsMap[type](diffNode, indent);
    })
    .join('\n');

  return `{\n${rows}\n${indent}}`;
};

export default (diffTree) => format(diffTree.children, '');
