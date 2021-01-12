import isPlainObject from 'lodash/isPlainObject.js';

const tab = ' '.repeat(2);
const actionPrefixMap = {
  unchanged: ' '.repeat(2),
  nested: ' '.repeat(2),
  added: '+ ',
  removed: '- ',
};

const getCurrentTab = (depth) => tab.repeat(2 * depth - 1);

const stringifyValue = (value, depth, format) => {
  if (!isPlainObject(value)) {
    return value;
  }

  const rows = Object.keys(value)
    .flatMap((key) => {
      const unchangedDiffNode = { key, type: 'unchanged', value: value[key] };
      return format(unchangedDiffNode, depth + 1);
    });
  const row = rows.join('\n');
  const currentTab = getCurrentTab(depth);

  return `{\n${row}\n${currentTab}${actionPrefixMap.unchanged}}`;
};

const format = (diffNode, depth) => {
  const {
    key, type, value, previousValue, currentValue, children,
  } = diffNode;
  const currentTab = type !== 'root' ? getCurrentTab(depth) : tab.repeat(0);
  switch (type) {
    case 'added':
    case 'removed':
    case 'unchanged':
      return `${currentTab}${actionPrefixMap[type]}${key}: ${stringifyValue(value, depth, format)}`;
    case 'updated':
      return [
        `${currentTab}${actionPrefixMap.removed}${key}: ${stringifyValue(previousValue, depth, format)}`,
        `${currentTab}${actionPrefixMap.added}${key}: ${stringifyValue(currentValue, depth, format)}`,
      ];
    case 'nested': {
      const row = children.flatMap((node) => format(node, depth + 1)).join('\n');
      return `${currentTab}${actionPrefixMap[type]}${key}: {\n${row}\n${currentTab}${actionPrefixMap[type]}}`;
    }
    case 'root': {
      const row = diffNode.children.map((node) => format(node, depth + 1)).join('\n');
      return `{\n${row}\n}`;
    }
    default:
      throw new Error(`unknown diffNode type: ${type}`);
  }
};

export default (diffTree) => format(diffTree, 0);
