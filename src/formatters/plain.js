import isPlainObject from 'lodash/isPlainObject.js';

const actionsMap = {
  added: 'was added with value:',
  removed: 'was removed',
  updated: 'was updated.',
};

const stringTypesMap = {
  added: (path, type, value) => `Property '${path}' ${actionsMap[type]} ${value}`,
  removed: (path, type) => `Property '${path}' ${actionsMap[type]}`,
  updated: (path, type, prevValue, value) => `Property '${path}' ${actionsMap[type]} From ${prevValue} to ${value}`,
};

const normalizeValue = (value) => {
  if (isPlainObject(value)) {
    return '[complex value]';
  }
  return typeof value === 'string'
    ? `'${value}'`
    : value;
};

const buildString = (path, type, value, prevValue) => {
  const string = type === 'updated'
    ? stringTypesMap[type](path, type, normalizeValue(prevValue), normalizeValue(value))
    : stringTypesMap[type](path, type, normalizeValue(value));

  return string;
};

const stringsMap = {
  updated: (keyNode, path) => buildString(path, keyNode.type, keyNode.value, keyNode.prevValue),
  added: (keyNode, path) => buildString(path, keyNode.type, keyNode.value),
  removed: (keyNode, path) => buildString(path, keyNode.type, keyNode.value),
};

export default (diffTree) => {
  const format = (currDiffTree, prevPath) => currDiffTree
    .reduce((acc, keyNode) => {
      const { type, key } = keyNode;
      const currentPath = prevPath === null ? key : `${prevPath}.${key}`;
      if (type === 'same') {
        return acc;
      }
      return type === 'parent'
        ? [...acc, format(keyNode.children, currentPath)]
        : [...acc, stringsMap[type](keyNode, currentPath)];
    }, [])
    .join('\n');

  return format(diffTree.children, null);
};
