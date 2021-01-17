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

const format = (diffNode, path) => {
  const {
    key, type, value, previousValue, currentValue, children,
  } = diffNode;
  switch (type) {
    case 'added':
      return `Property '${[...path, key].join('.')}' was added with value: ${normalizeValue(value)}`;
    case 'removed':
      return `Property '${[...path, key].join('.')}' was removed`;
    case 'updated':
      return `Property '${[...path, key].join('.')}' was updated. From ${normalizeValue(previousValue)} to ${normalizeValue(currentValue)}`;
    case 'unchanged':
      return [];
    case 'nested':
      return children.flatMap((node) => format(node, [...path, key]));
    case 'root': {
      const rows = children.flatMap((node) => format(node, path));
      return rows.join('\n');
    }
    default:
      throw new Error(`Unknown diffNode type: ${type}`);
  }
};

export default (diffTree) => format(diffTree, []);
