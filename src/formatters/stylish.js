import isPlainObject from 'lodash/isPlainObject.js';

const tab = ' '.repeat(2);
const actionPrefixMap = {
  unchanged: ' '.repeat(2),
  nested: ' '.repeat(2),
  added: '+ ',
  removed: '- ',
};

// (2n-1)*tab - смещение 2tab на каждый уровень кроме root
// На root именно 2tab - 1tab, потому что перед ним нет ключа
// Запись “n * tab” Упрощенная версия tab.repeat(n)
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

const handleDiffNode = (diffNode, depth, format) => {
  const { key, type, value, previousValue, currentValue } = diffNode;
  const currentTab = type === 'root' ? tab.repeat(1) : getCurrentTab(depth);

  switch (type) {
    case 'added':
    case 'removed':
    case 'unchanged': {
      return `${currentTab}${actionPrefixMap[type]}${key}: ${stringifyValue(value, depth, format)}`;
    }
    case 'updated': {
      return [
        `${currentTab}${actionPrefixMap.removed}${key}: ${stringifyValue(previousValue, depth, format)}`,
        `${currentTab}${actionPrefixMap.added}${key}: ${stringifyValue(currentValue, depth, format)}`,
      ];
    }
    case 'nested': {
      const currentTab = getCurrentTab(depth);
      const { key, children } = diffNode;
      const rows = children.flatMap((node) => format(node, depth + 1));
      const row = rows.join('\n');
      return `${currentTab}${actionPrefixMap[type]}${key}: {\n${row}\n${currentTab}${actionPrefixMap[type]}}`;
    }
    case 'root': {
      const rows = diffNode.children.map((node) => format(node, depth + 1));
      const row = rows.join('\n');
      return `{\n${row}\n}`;
    }
    default:
      throw new Error(`unknown diffNode type: ${type}`);;
  }
};

// const format = (diffNode, depth) => nodeHandlers[diffNode.type](diffNode, depth, format);
const format = (diffNode, depth) => handleDiffNode(diffNode, depth, format);

export default (diffTree) => format(diffTree, 0);



// const nodeHandlers = {
//   unchanged: (diffNode, depth, format) => {
//     const { currentTab, key, value } = buildStringValues(diffNode, depth, format);
//     return `${currentTab}${unchangedPrefix}${key}: ${value}`;
//   },
//   updated: (diffNode, depth, format) => {
//     const {
//       currentTab, key, previousValue, currentValue,
//     } = buildStringValues(diffNode, depth, format);
//     return [
//       `${currentTab}${removedPrefix}${key}: ${previousValue}`,
//       `${currentTab}${addedPrefix}${key}: ${currentValue}`,
//     ];
//   },
//   added: (diffNode, depth, format) => {
//     const { currentTab, key, value } = buildStringValues(diffNode, depth, format);
//     return `${currentTab}${addedPrefix}${key}: ${value}`;
//   },
//   removed: (diffNode, depth, format) => {
//     const { currentTab, key, value } = buildStringValues(diffNode, depth, format);
//     return `${currentTab}${removedPrefix}${key}: ${value}`;
//   },
//   nested: (diffNode, depth, format) => {
//     const currentTab = getCurrentTab(depth);
//     const { key, children } = diffNode;
//     const rows = children.flatMap((node) => format(node, depth + 1));
//     const row = rows.join('\n');
//     return `${currentTab}${nestedPrefix}${key}: {\n${row}\n${currentTab}${nestedPrefix}}`;
//   },
//   root: (diffNode, depth, format) => {
//     const rows = diffNode.children.map((node) => format(node, depth + 1));
//     const row = rows.join('\n');
//     return `{\n${row}\n}`;
//   },
// };
