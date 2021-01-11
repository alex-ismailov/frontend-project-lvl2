import isPlainObject from 'lodash/isPlainObject.js';

const indent = ' '.repeat(2); // 4 spaces
const actionPrefixMap = {
  unchanged: '  ', // 4 spaces
  added: '+ ',
  removed: '- ',
};

/* Сurrent Indent is calculated using
the arithmetic progression formula */
const getCurrentIndent = (depth) => {
  const first = 1;
  const diff = 2;
  const level = first + diff * (Number(depth) - 1);

  return indent.repeat(level);
};

// const getCurrentIndent2 = (depth) => {
//   const level = 2 * Number(depth) - 1;
//   return indent.repeat(level);
// };
// Рассмотреть еще вот эту формулу
// yn = 2n – 1 – последовательность нечетных чисел: 1, 3, 5, 7, 9,

const buildRows = (obj, depth) => Object.keys(obj)
  .flatMap((key) => {
    const currentIndent = getCurrentIndent(depth);
    if (isPlainObject(obj[key])) {
      return [
        `${currentIndent}${actionPrefixMap.unchanged}${key}: {`,
        ...buildRows(obj[key], depth + 1),
        `${currentIndent}${actionPrefixMap.unchanged}}`,
      ];
    }

    return `${currentIndent}${actionPrefixMap.unchanged}${key}: ${obj[key]}`;
  });

const buildStringFromObj = (obj, depth) => {
  const rows = buildRows(obj, depth);

  return `${rows.join('\n')}`;
};

const buildString = (depth, type, key, value) => {
  const currentIndent = getCurrentIndent(depth);
  if (isPlainObject(value)) {
    const nestedString = buildStringFromObj(value, depth + 1);
    return `${currentIndent}${actionPrefixMap[type]}${key}: {\n${nestedString}\n${currentIndent}${actionPrefixMap.unchanged}}`;
  }

  return `${currentIndent}${actionPrefixMap[type]}${key}: ${value}`;
};

const nodeHandlers = {
  unchanged: (diffNode, depth) => buildString(depth, diffNode.type, diffNode.key, diffNode.value),
  updated: (diffNode, depth) => [
    buildString(depth, 'removed', diffNode.key, diffNode.previousValue),
    buildString(depth, 'added', diffNode.key, diffNode.currentValue),
  ],
  added: (diffNode, depth) => buildString(depth, diffNode.type, diffNode.key, diffNode.value),
  removed: (diffNode, depth) => buildString(depth, diffNode.type, diffNode.key, diffNode.value),
  nested: (diffNode, depth, format) => {
    const rows = diffNode.children.flatMap((node) => format(node, depth + 1));
    const row = rows.join('\n');
    const currentIndent = getCurrentIndent(depth);
    return buildString(depth, 'unchanged', diffNode.key, `{\n${row}\n${currentIndent}${actionPrefixMap.unchanged}}`);
  },
  root: (diffNode, depth, format) => {
    const rows = diffNode.children.map((node) => format(node, depth + 1));
    const row = rows.join('\n');
    return `{\n${row}\n}`;
  },
};

const format = (diffNode, depth) => nodeHandlers[diffNode.type](diffNode, depth, format);

export default (diffTree) => format(diffTree, 0);
