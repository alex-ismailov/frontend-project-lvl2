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

const stringifyValue = (value, depth) => {
  if (!isPlainObject(value)) {
    return value;
  }

  const rows = Object.keys(value)
    .flatMap((key) => {
      const currentTab = getCurrentTab(depth + 1);
      if (!isPlainObject(value[key])) {
        return `${currentTab}${unchangedPrefix}${key}: ${value[key]}`;
      }
      const row = stringifyValue(value[key], depth + 1);
      return `${currentTab}${unchangedPrefix}${key}: ${row}`;
    });

  const row = rows.join('\n');
  const currentTab = getCurrentTab(depth);

  return `{\n${row}\n${currentTab}${unchangedPrefix}}`;
};

const buildStringValues = (diffNode, depth) => {
  const currentTab = getCurrentTab(depth);
  const { key, type, value } = diffNode;

  if (type === 'updated') {
    const { previousValue, currentValue } = diffNode;
    const previousValueRow = stringifyValue(previousValue, depth);
    const currentValueRow = stringifyValue(currentValue, depth);
    return {
      currentTab,
      key,
      previousValueRow,
      currentValueRow,
    };
  }

  const row = stringifyValue(value, depth);
  return {
    currentTab,
    key,
    row,
  };
};

const nodeHandlers = {
  unchanged: (diffNode, depth) => {
    const { currentTab, key, row } = buildStringValues(diffNode, depth);
    return `${currentTab}${unchangedPrefix}${key}: ${row}`;
  },
  updated: (diffNode, depth) => {
    const {
      currentTab, key, previousValueRow, currentValueRow,
    } = buildStringValues(diffNode, depth);
    return [
      `${currentTab}${removedPrefix}${key}: ${previousValueRow}`,
      `${currentTab}${addedPrefix}${key}: ${currentValueRow}`,
    ];
  },
  added: (diffNode, depth) => {
    const { currentTab, key, row } = buildStringValues(diffNode, depth);
    return `${currentTab}${addedPrefix}${key}: ${row}`;
  },
  removed: (diffNode, depth) => {
    const { currentTab, key, row } = buildStringValues(diffNode, depth);
    return `${currentTab}${removedPrefix}${key}: ${row}`;
  },
  nested: (diffNode, depth, format) => {
    const { key, children } = diffNode;
    const rows = children.flatMap((node) => format(node, depth + 1));
    const row = rows.join('\n');
    const currentTab = getCurrentTab(depth);
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
