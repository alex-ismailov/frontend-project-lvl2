import isPlainObject from 'lodash/isPlainObject.js';

const tab = ' '.repeat(2);

/* When you dive 1 level deep into the tree, an offset of 2 tabs is added,
except for the root node. The root node adds an offset of 1 tab,
so there is no key in front of it. */
const getIndent = (depth) => tab.repeat(2 * depth - 1);

const stringifyValue = (value, depth, format) => {
  if (!isPlainObject(value)) {
    return value;
  }

  const rows = Object.keys(value)
    .flatMap((key) => {
      const unchangedDiffNode = { key, type: 'unchanged', value: value[key] };
      return format(unchangedDiffNode, depth + 1);
    });
  const currentIndent = getIndent(depth);

  return `{\n${rows.join('\n')}\n${currentIndent}${getIndent(1)}}`;
};

const format = (diffNode, depth) => {
  const {
    key, type, value, previousValue, currentValue, children,
  } = diffNode;
  switch (type) {
    case 'added':
      return `${getIndent(depth)}+ ${key}: ${stringifyValue(value, depth, format)}`;
    case 'removed':
      return `${getIndent(depth)}- ${key}: ${stringifyValue(value, depth, format)}`;
    case 'unchanged':
      return `${getIndent(depth)}${' '.repeat(2)}${key}: ${stringifyValue(value, depth, format)}`;
    case 'updated':
      return [
        `${getIndent(depth)}- ${key}: ${stringifyValue(previousValue, depth, format)}`,
        `${getIndent(depth)}+ ${key}: ${stringifyValue(currentValue, depth, format)}`,
      ];
    case 'nested': {
      const rows = children.flatMap((node) => format(node, depth + 1));
      return `${getIndent(depth)}${' '.repeat(2)}${key}: {\n${rows.join('\n')}\n${getIndent(depth)}${getIndent(1)}}`;
    }
    case 'root': {
      const rows = diffNode.children.map((node) => format(node, depth + 1));
      return `{\n${rows.join('\n')}\n}`;
    }
    default:
      throw new Error(`Unknown diffNode type: ${type}`);
  }
};

export default (diffTree) => format(diffTree, 0);
