import isPlainObject from 'lodash/isPlainObject.js';

const indent = '    '; // it`s two spaces
const actionPrefixMap = {
  unchanged: '    ',
  added: '  + ',
  removed: '  - ',
  nested: '    ',
};

const buildRows = (obj, depth) => Object.keys(obj)
  .flatMap((key) => {
    if (isPlainObject(obj[key])) {
      return [
        `${indent.repeat(depth)}${actionPrefixMap.nested}${key}: {`,
        ...buildRows(obj[key], depth + 1),
        `${indent.repeat(depth)}}`,
      ];
    }

    return `${indent.repeat(depth)}${actionPrefixMap.unchanged}${key}: ${obj[key]}`;
  });

// const buildStringFromObj = (obj, depth) => (
//   `{\n${buildRows(obj, depth).join('\n')}\n${indent.repeat(depth)}}`
// );

const buildString = (depth, type, key, value) => {
  if (isPlainObject(value)) {
    // const nestedString = buildStringFromObj(value, depth);
    const rows = buildRows(value, depth).join('\n');
    const nestedString = `{\n${indent.repeat(depth)}${rows}\n${indent.repeat(depth)}`;
    return `${indent.repeat(depth)}${actionPrefixMap[type]}${key}: ${nestedString}${indent.repeat(depth)}}`;
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
    const rows = diffNode.children.flatMap((node) => format(node, depth + 1)).join('\n');
    return buildString(depth, diffNode.type, diffNode.key, `{\n${rows}\n${indent.repeat(depth + 1)}}`);
  },
  root: (diffNode, depth, format) => {
    const rows = diffNode.children.map((node) => format(node, depth)).join('\n');
    return rows;
  },
};

const format = (diffNode, depth) => nodeHandlers[diffNode.type](diffNode, depth, format);

export default (diffTree) => `{\n${format(diffTree, 0)}\n}`;
