import _ from 'lodash';

const tab = ' '.repeat(2);

/* Since the root diffNode does not have a diff sign, unlike the other diffNodes
in order to maintain correct visual nesting, we add a double space to the main indentation
at each nesting level, except when we are at the root diffNode level. */
const getIndent = (depth) => tab.repeat(depth) + '  '.repeat(depth - 1);

const stringifyValue = (value, depth, format) => {
  if (!_.isPlainObject(value)) {
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
