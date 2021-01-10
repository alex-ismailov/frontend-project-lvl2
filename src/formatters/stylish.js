import isPlainObject from 'lodash/isPlainObject.js';

const indent = ' '.repeat(2); // 4 spaces
const actionPrefixMap = {
  unchanged: '  ', // 4 spaces
  added: '+ ',
  removed: '- ',
};

const buildRows = (obj, depth) => Object.keys(obj)
  .flatMap((key) => {
    if (isPlainObject(obj[key])) {
      return [
        `${indent.repeat(depth)}${actionPrefixMap.unchanged}${key}: {`,
        ...buildRows(obj[key], depth + 2),
        `${indent.repeat(depth)}${actionPrefixMap.unchanged}}`,
      ];
    }

    return `${indent.repeat(depth)}${actionPrefixMap.unchanged}${key}: ${obj[key]}`;
  });

const buildStringFromObj = (obj, depth) => {
  const rows = buildRows(obj, depth);

  return `${rows.join('\n')}`;
};

const buildString = (depth, type, key, value) => {
  if (isPlainObject(value)) {
    const nestedString = buildStringFromObj(value, depth + 2);
    return `${indent.repeat(depth)}${actionPrefixMap[type]}${key}: {\n${nestedString}\n${indent.repeat(depth)}${actionPrefixMap['unchanged']}}`;
  }

  return `${indent.repeat(depth)}${actionPrefixMap[type]}${key}: ${value}`;
};

const nodeHandlers = {
  unchanged: (diffNode, depth) => buildString(depth, diffNode.type, diffNode.key, diffNode.value),
  updated: (diffNode, depth) => [
    buildString(depth, 'removed', diffNode.key, diffNode.previousValue),
    buildString(depth, 'added', diffNode.key, diffNode.currentValue),
  ],
  added: (diffNode, depth) => buildString(depth, diffNode.type, diffNode.key, diffNode.value),
  removed: (diffNode, depth) => buildString(depth, diffNode.type, diffNode.key, diffNode.value),
  nested: (diffNode, depth, format) => {
    const rows = diffNode.children.flatMap((node) => format(node, depth + 2));
    const row = rows.join('\n');
    return buildString(depth, 'unchanged', diffNode.key, `{\n${row}\n${indent.repeat(depth + 1)}}`);
  },
  root: (diffNode, depth, format) => {
    const rows = diffNode.children.map((node) => format(node, depth + 1));
    const row = rows.join('\n');
    return `{\n${row}\n}`;
  },
};

const format = (diffNode, depth) => nodeHandlers[diffNode.type](diffNode, depth, format);

export default (diffTree) => format(diffTree, 0);
