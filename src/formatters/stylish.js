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
  const rows = Object.keys(value).flatMap((key) => {
    const unchangedDiffNode = { key, type: 'unchanged', value: value[key] };

    return format(unchangedDiffNode, depth + 1);
  });

  const row = rows.join('\n');
  const currentTab = getCurrentTab(depth);

  return `{\n${row}\n${currentTab}${unchangedPrefix}}`;
};

const buildStringValues = (diffNode, depth, format) => {
  const currentTab = getCurrentTab(depth);
  const { key, type, value } = diffNode;

  if (type === 'updated') {
    const { previousValue, currentValue } = diffNode;
    const previousValueRow = stringifyValue(previousValue, depth, format);
    const currentValueRow = stringifyValue(currentValue, depth, format);
    return {
      currentTab,
      key,
      previousValueRow,
      currentValueRow,
    };
  }

  const row = stringifyValue(value, depth, format);
  return {
    currentTab,
    key,
    row,
  };
};

const nodeHandlers = {
  unchanged: (diffNode, depth, format) => {
    const { currentTab, key, row } = buildStringValues(diffNode, depth, format);
    return `${currentTab}${unchangedPrefix}${key}: ${row}`;
  },
  updated: (diffNode, depth, format) => {
    const {
      currentTab, key, previousValueRow, currentValueRow,
    } = buildStringValues(diffNode, depth, format);
    return [
      `${currentTab}${removedPrefix}${key}: ${previousValueRow}`,
      `${currentTab}${addedPrefix}${key}: ${currentValueRow}`,
    ];
  },
  added: (diffNode, depth, format) => {
    const { currentTab, key, row } = buildStringValues(diffNode, depth, format);
    return `${currentTab}${addedPrefix}${key}: ${row}`;
  },
  removed: (diffNode, depth, format) => {
    const { currentTab, key, row } = buildStringValues(diffNode, depth, format);
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
