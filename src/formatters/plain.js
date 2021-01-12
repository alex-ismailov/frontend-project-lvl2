import isPlainObject from 'lodash/isPlainObject.js';
import isString from 'lodash/isString.js';

const normalizeValue = (value) => {
  if (isPlainObject(value)) {
    return '[complex value]';
  }
  return isString(value)
    ? `'${value}'`
    : value;
};

const format = (diffNode, previousPath) => {
  const {
    key, type, value, previousValue, currentValue, children,
  } = diffNode;
  const currentPath = previousPath === null ? key : `${previousPath}.${key}`;

  switch (type) {
    case 'added':
      return `Property '${currentPath}' was added with value: ${normalizeValue(value)}`;
    case 'removed':
      return `Property '${currentPath}' was removed`;
    case 'updated':
      return `Property '${currentPath}' was updated. From ${normalizeValue(previousValue)} to ${normalizeValue(currentValue)}`;
    case 'unchanged':
      return [];
    case 'nested':
      return children.flatMap((node) => format(node, currentPath));
    case 'root':
      return children.flatMap((node) => format(node, previousPath)).join('\n');
    default:
      throw new Error(`unknown diffNode type: ${type}`);
  }
};

export default (diffTree) => format(diffTree, null);
