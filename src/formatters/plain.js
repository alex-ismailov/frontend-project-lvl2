import _ from 'lodash';
// import isString from 'lodash/isString.js';

const stringifyValue = (value) => {
  if (_.isObjectLike(value)) {
    return '[complex value]';
  }
  return _.isString(value)
    ? `'${value}'`
    : value;
};

const format = (diffNode, path) => {
  const {
    key, type, value, previousValue, currentValue, children,
  } = diffNode;
  switch (type) {
    case 'added':
      return `Property '${[...path, key].join('.')}' was added with value: ${stringifyValue(value)}`;
    case 'removed':
      return `Property '${[...path, key].join('.')}' was removed`;
    case 'updated':
      return `Property '${[...path, key].join('.')}' was updated. From ${stringifyValue(previousValue)} to ${stringifyValue(currentValue)}`;
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
