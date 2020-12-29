import isPlainObject from 'lodash/isPlainObject.js';
import isString from 'lodash/isString.js';

const actionsMap = {
  added: 'was added with value:',
  removed: 'was removed',
  updated: 'was updated.',
};

const stringTypesMap = {
  added: (path, type, value) => `Property '${path}' ${actionsMap[type]} ${value}`,
  removed: (path, type) => `Property '${path}' ${actionsMap[type]}`,
  updated: (path, type, previousValue, value) => `Property '${path}' ${actionsMap[type]} From ${previousValue} to ${value}`,
};

const normalizeValue = (value) => {
  if (isPlainObject(value)) {
    return '[complex value]';
  }
  return isString(value)
    ? `'${value}'`
    : value;
};

const buildString = (path, type, value, previousValue) => {
  const string = type === 'updated'
    ? stringTypesMap[type](path, type, normalizeValue(previousValue), normalizeValue(value))
    : stringTypesMap[type](path, type, normalizeValue(value));

  return string;
};

const stringsMap = {
  updated: (diffNode, path) => buildString(
    path, diffNode.type, diffNode.value, diffNode.previousValue,
  ),
  added: (diffNode, path) => buildString(path, diffNode.type, diffNode.value),
  removed: (diffNode, path) => buildString(path, diffNode.type, diffNode.value),
  nested: (diffNode, path, format) => format(diffNode, path),
  unchanged: () => [],
};

const format = (diffTree, pathBefore) => diffTree.children
  .flatMap((diffNode) => {
    const { type, key } = diffNode;
    const currentPath = pathBefore === null ? key : `${pathBefore}.${key}`;

    return stringsMap[type](diffNode, currentPath, format);
  })
  .join('\n');

export default (diffTree) => format(diffTree, null);
