import isPlainObject from 'lodash/isPlainObject.js';

const tab = ' '.repeat(2);
const diffPrefixesMap = {
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

  return `{\n${row}\n${currentTab}${diffPrefixesMap.unchanged}}`;
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
      return `${currentTab}${diffPrefixesMap[type]}${key}: ${stringifyValue(value, depth, format)}`;
    case 'updated':
      return [
        `${currentTab}${diffPrefixesMap.removed}${key}: ${stringifyValue(previousValue, depth, format)}`,
        `${currentTab}${diffPrefixesMap.added}${key}: ${stringifyValue(currentValue, depth, format)}`,
      ];
    case 'nested': {
      const rows = children.flatMap((node) => format(node, depth + 1));
      const row = rows.join('\n');
      return `${currentTab}${diffPrefixesMap[type]}${key}: {\n${row}\n${currentTab}${diffPrefixesMap[type]}}`;
    }
    case 'root': {
      const rows = diffNode.children.map((node) => format(node, depth + 1));
      const row = rows.join('\n');
      return `{\n${row}\n}`;
    }
    default:
      throw new Error(`unknown diffNode type: ${type}`);
  }
};

export default (diffTree) => format(diffTree, 0);
