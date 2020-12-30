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

const stringTypesMap = {
  added: (path, type, value) => `Property '${path}' ${actionsMap[type]} ${value}`,
  removed: (path, type) => `Property '${path}' ${actionsMap[type]}`,
  updated: (path, type, previousValue, value) => `Property '${path}' ${actionsMap[type]} From ${previousValue} to ${value}`,
};

const buildString = (path, type, value, previousValue) => {
  const string = type === 'updated'
    ? stringTypesMap[type](path, type, normalizeValue(previousValue), normalizeValue(value))
    : stringTypesMap[type](path, type, normalizeValue(value));

  return string;
};

const nodeHandlers = {
  updated: (diffNode, path) => {
    const currentPath = path === null ? diffNode.key : `${path}.${diffNode.key}`;
    return buildString(
      currentPath, diffNode.type, diffNode.currentValue, diffNode.previousValue,
    );
  },
  added: (diffNode, path) => {
    const currentPath = path === null ? diffNode.key : `${path}.${diffNode.key}`;
    return buildString(currentPath, diffNode.type, diffNode.value);
  },
  removed: (diffNode, path) => {
    const currentPath = path === null ? diffNode.key : `${path}.${diffNode.key}`;
    return buildString(currentPath, diffNode.type, diffNode.value);
  },
  unchanged: () => [],
  nested: (diffNode, path, format) => {
    const currentPath = path === null ? diffNode.key : `${path}.${diffNode.key}`;
    const rows = diffNode.children.flatMap((node) => format(node, currentPath));

    return rows;
  },
  root: (diffNode, path, format) => {
    // const currentPath = path === null ? diffNode.key : `${path}.${diffNode.key}`;
    const rows = diffNode.children
      .flatMap((node) => format(node, path)).join('\n');

    return rows;
  },
};

const format = (diffNode, pathBefore) => nodeHandlers[diffNode.type](diffNode, pathBefore, format);

export default (diffTree) => format(diffTree, null);
