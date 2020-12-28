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
  updated: (path, type, valueBefore, value) => `Property '${path}' ${actionsMap[type]} From ${valueBefore} to ${value}`,
};

const normalizeValue = (value) => {
  if (isPlainObject(value)) {
    return '[complex value]';
  }
  return isString(value)
    ? `'${value}'`
    : value;
};

const buildString = (path, type, value, valueBefore) => {
  const string = type === 'updated'
    ? stringTypesMap[type](path, type, normalizeValue(valueBefore), normalizeValue(value))
    : stringTypesMap[type](path, type, normalizeValue(value));

  return string;
};

const stringsMap = {
  updated: (diffNode, path) => buildString(
    path, diffNode.type, diffNode.value, diffNode.valueBefore,
  ),
  added: (diffNode, path) => buildString(path, diffNode.type, diffNode.value),
  removed: (diffNode, path) => buildString(path, diffNode.type, diffNode.value),
};

const format = (currDiffTree, pathBefore) => currDiffTree
  .reduce((acc, diffNode) => {
    const { type, key } = diffNode;
    const currentPath = pathBefore === null ? key : `${pathBefore}.${key}`;
    if (type === 'unchanged') {
      return acc;
    }
    return type === 'nested'
      ? [...acc, format(diffNode.children, currentPath)]
      : [...acc, stringsMap[type](diffNode, currentPath)];
  }, [])
  .join('\n');

export default (diffTree) => format(diffTree.children, null);
