import isObjectLike from 'lodash/isObjectLike.js';
import isString from 'lodash/isString.js';

const normalizeValue = (value) => {
  if (isObjectLike(value)) {
    return '[complex value]';
  }
  return isString(value)
    ? `'${value}'`
    : value;
};

const buildPath = (previousPath, currentPath) => {
  if (previousPath) {
    return `${previousPath}.${currentPath}`;
  }
  return currentPath;
};

const format = (diffNode, previousPath) => {
  const {
    key, type, value, previousValue, currentValue, children,
  } = diffNode;
  switch (type) {
    case 'added':
      return `Property '${buildPath(previousPath, key)}' was added with value: ${normalizeValue(value)}`;
    case 'removed':
      return `Property '${buildPath(previousPath, key)}' was removed`;
    case 'updated':
      return `Property '${buildPath(previousPath, key)}' was updated. From ${normalizeValue(previousValue)} to ${normalizeValue(currentValue)}`;
    case 'unchanged':
      return [];
    case 'nested': {
      const currentPath = buildPath(previousPath, key);
      return children.flatMap((node) => format(node, currentPath));
    }
    case 'root':
      return children.flatMap((node) => format(node, previousPath)).join('\n');
    default:
      throw new Error(`unknown diffNode type: ${type}`);
  }
};

export default (diffTree) => format(diffTree, null);
