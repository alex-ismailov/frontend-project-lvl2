import isPlainObject from 'lodash/isPlainObject.js';
import isString from 'lodash/isString.js';

const actionsMap = {
  added: 'was added with value:',
  removed: 'was removed',
  updated: 'was updated.',
};

const normalizeValue = (value) => {
  if (isPlainObject(value)) {
    return '[complex value]';
  }
  return isString(value)
    ? `'${value}'`
    : value;
};

const stringsMap = {
  added: (path, type, value) => `Property '${path}' ${actionsMap[type]} ${value}`,
  removed: (path, type) => `Property '${path}' ${actionsMap[type]}`,
  updated: (path, type, previousValue, currentValue) => (
    `Property '${path}' ${actionsMap[type]} From ${previousValue} to ${currentValue}`
  ),
};

const buildString = (diffNode, previousPath) => {
  const {
    key, type, value, previousValue, currentValue,
  } = diffNode;
  const currentPath = previousPath === null ? key : `${previousPath}.${key}`;

  return type === 'updated'
    ? stringsMap[type](
      currentPath, type, normalizeValue(previousValue), normalizeValue(currentValue),
    )
    : stringsMap[type](currentPath, type, normalizeValue(value));
};

const nodeHandlers = {
  updated: (diffNode, previousPath) => buildString(diffNode, previousPath),
  added: (diffNode, previousPath) => buildString(diffNode, previousPath),
  removed: (diffNode, previousPath) => buildString(diffNode, previousPath),
  unchanged: () => [],
  nested: (diffNode, previousPath, format) => {
    const currentPath = previousPath === null ? diffNode.key : `${previousPath}.${diffNode.key}`;
    return diffNode.children.flatMap((node) => format(node, currentPath));
  },
  root: (diffNode, previousPath, format) => (
    diffNode.children.flatMap((node) => format(node, previousPath)).join('\n')
  ),
};

const format = (diffNode, previousPath) => (
  nodeHandlers[diffNode.type](diffNode, previousPath, format)
);

export default (diffTree) => format(diffTree, null);
