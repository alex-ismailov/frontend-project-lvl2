import isPlainObject from 'lodash/isPlainObject.js';

const tab = ' '.repeat(2);
const unchangedPrefix = ' '.repeat(2);
const nestedPrefix = ' '.repeat(2);
const addedPrefix = '+ ';
const removedPrefix = '- ';

// (2n-1)*tab
const getCurrentTab = (depth) => {
  const level = (2 * depth - 1) * 1;
  return tab.repeat(level);
};

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

  return `{\n${row}\n${currentTab}${unchangedPrefix}}`;
};

const buildStringValues = (diffNode, depth, format) => {
  const currentTab = getCurrentTab(depth);
  const {
    key, type, value, previousValue, currentValue,
  } = diffNode;

  return type === 'updated'
    ? {
      currentTab,
      key,
      previousValue: stringifyValue(previousValue, depth, format),
      currentValue: stringifyValue(currentValue, depth, format),
    }
    : {
      currentTab,
      key,
      value: stringifyValue(value, depth, format),
    };
};

const nodeHandlers = {
  unchanged: (diffNode, depth, format) => {
    const { currentTab, key, value } = buildStringValues(diffNode, depth, format);
    return `${currentTab}${unchangedPrefix}${key}: ${value}`;
  },
  updated: (diffNode, depth, format) => {
    const {
      currentTab, key, previousValue, currentValue,
    } = buildStringValues(diffNode, depth, format);
    return [
      `${currentTab}${removedPrefix}${key}: ${previousValue}`,
      `${currentTab}${addedPrefix}${key}: ${currentValue}`,
    ];
  },
  added: (diffNode, depth, format) => {
    const { currentTab, key, value } = buildStringValues(diffNode, depth, format);
    return `${currentTab}${addedPrefix}${key}: ${value}`;
  },
  removed: (diffNode, depth, format) => {
    const { currentTab, key, value } = buildStringValues(diffNode, depth, format);
    return `${currentTab}${removedPrefix}${key}: ${value}`;
  },
  nested: (diffNode, depth, format) => {
    const currentTab = getCurrentTab(depth);
    const { key, children } = diffNode;
    const rows = children.flatMap((node) => format(node, depth + 1));
    const row = rows.join('\n');
    return `${currentTab}${nestedPrefix}${key}: {\n${row}\n${currentTab}${nestedPrefix}}`;
  },
  root: (diffNode, depth, format) => {
    const rows = diffNode.children.map((node) => format(node, depth + 1));
    const row = rows.join('\n');
    return `{\n${row}\n}`;
  },
};

const format = (diffNode, depth) => nodeHandlers[diffNode.type](diffNode, depth, format);

export default (diffTree) => format(diffTree, 0);
