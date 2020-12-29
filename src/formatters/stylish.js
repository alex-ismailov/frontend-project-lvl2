import isPlainObject from 'lodash/isPlainObject.js';

const actionPrefixMap = {
  unchanged: '    ',
  added: '  + ',
  removed: '  - ',
};

const buildRows = (obj, indent) => Object.keys(obj)
  .flatMap((key) => {
    if (isPlainObject(obj[key])) {
      return [
        `${indent}${actionPrefixMap.unchanged}${key}: {`,
        ...buildRows(obj[key], indent + ' '.repeat(4)),
        `${indent + ' '.repeat(4)}}`,
      ];
    }

    return `${indent}${actionPrefixMap.unchanged}${key}: ${obj[key]}`;
  });

const buildStringFromObj = (obj, indent) => (
  `{\n${buildRows(obj, indent).join('\n')}\n${indent}}`
);

const buildString = (indent, type, key, value) => {
  if (isPlainObject(value)) {
    const nestedStructureStr = buildStringFromObj(value, indent + ' '.repeat(4));
    return `${indent}${actionPrefixMap[type]}${key}: ${nestedStructureStr}`;
  }

  return `${indent}${actionPrefixMap[type]}${key}: ${value}`;
};

const nodeHandlers = {
  unchanged: (diffNode, indent) => buildString(indent, diffNode.type, diffNode.key, diffNode.value),
  updated: (diffNode, indent) => [
    buildString(indent, 'removed', diffNode.key, diffNode.previousValue),
    buildString(indent, 'added', diffNode.key, diffNode.currentValue),
  ],
  added: (diffNode, indent) => buildString(indent, diffNode.type, diffNode.key, diffNode.value),
  removed: (diffNode, indent) => buildString(indent, diffNode.type, diffNode.key, diffNode.value),
  nested: (diffNode, indent, format) => {
    const rows = diffNode.children.flatMap((node) => format(node, indent + ' '.repeat(4))).join('\n');
    return buildString(indent, 'unchanged', diffNode.key, `{\n${rows}\n${indent + ' '.repeat(4)}}`);
  },
  root: (diffNode, indent, format) => {
    const rows = diffNode.children.map((node) => format(node, indent)).join('\n');
    return `{\n${rows}\n}`;
  },
};

const format = (diffNode, indent) => nodeHandlers[diffNode.type](diffNode, indent, format);

export default (diffTree) => format(diffTree, '');
