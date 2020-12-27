import isPlainObject from 'lodash/isPlainObject.js';

const actionPrefixMap = {
  same: '    ',
  added: '  + ',
  removed: '  - ',
};

const buildStringFromObj = (obj, indent) => {
  const iter = (currObj, currIndent) => {
    const keys = Object.keys(currObj);
    const objString = keys.flatMap((key) => {
      if (isPlainObject(currObj[key])) {
        return [
          `${currIndent}${actionPrefixMap.same}${key}: {`,
          ...iter(currObj[key], currIndent + ' '.repeat(4)),
          `${currIndent + ' '.repeat(4)}}`,
        ];
      }
      return `${currIndent}${actionPrefixMap.same}${key}: ${currObj[key]}`;
    });

    return objString;
  };

  return `{\n${iter(obj, indent).join('\n')}\n${indent}}`;
};

const buildString = (indent, type, key, value) => {
  if (isPlainObject(value)) {
    const nestedStructureStr = buildStringFromObj(value, indent + ' '.repeat(4));
    return `${indent}${actionPrefixMap[type]}${key}: ${nestedStructureStr}`;
  }

  return `${indent}${actionPrefixMap[type]}${key}: ${value}`;
};

const stringsMap = {
  same: (keyNode, indent) => buildString(indent, keyNode.type, keyNode.name, keyNode.value),
  updated: (keyNode, indent) => [
    buildString(indent, 'removed', keyNode.name, keyNode.prevValue),
    buildString(indent, 'added', keyNode.name, keyNode.value),
  ],
  added: (keyNode, indent) => buildString(indent, keyNode.type, keyNode.name, keyNode.value),
  removed: (keyNode, indent) => buildString(indent, keyNode.type, keyNode.name, keyNode.value),
  parent: (keyNode, indent, format) => {
    const value = format(keyNode.children, indent + ' '.repeat(4));
    return buildString(indent, 'same', keyNode.name, value);
  },
};

export default (diffTree) => {
  const format = (currDiffTree, currIndent) => {
    const rows = currDiffTree
      .flatMap((keyNode) => {
        const { type } = keyNode;
        return type === 'parent'
          ? stringsMap[type](keyNode, currIndent, format)
          : stringsMap[type](keyNode, currIndent);
      })
      .join('\n');

    return `{\n${rows}\n${currIndent}}`;
  };

  return format(diffTree.children, '');
};
