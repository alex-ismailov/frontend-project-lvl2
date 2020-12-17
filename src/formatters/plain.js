import { isObject } from '../utils.js';

const actionsMap = {
  added: 'was added with value:',
  removed: 'was removed',
  updated: 'was updated.',
};

const stringTypesMap = {
  added: (path, type, value) => `Property '${path}' ${actionsMap[type]} ${value}`,
  removed: (path, type) => `Property '${path}' ${actionsMap[type]}`,
  updated: (path, type, prevValue, value) => `Property '${path}' ${actionsMap[type]} From ${prevValue} to ${value}`,
};

const normalizeValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }
  return typeof value === 'string'
    ? `'${value}'`
    : value;
};

const makeString = (path, type, value, prevValue) => (
  type === 'updated'
    ? stringTypesMap[type](path, type, normalizeValue(prevValue), normalizeValue(value))
    : stringTypesMap[type](path, type, normalizeValue(value))
);

const stringsMap = {
  updated: (keyNode, path) => makeString(path, keyNode.type, keyNode.value, keyNode.prevValue),
  added: (keyNode, path) => makeString(path, keyNode.type, keyNode.value),
  removed: (keyNode, path) => makeString(path, keyNode.type, keyNode.value),
};

export default (ast) => {
  const formatterIter = (currentAst, prevPath) => currentAst
    .reduce((acc, keyNode) => {
      const { type, name } = keyNode;
      const currentPath = prevPath === null ? name : `${prevPath}.${name}`;
      if (type === 'same') {
        return acc;
      }

      return type === 'parent'
        ? [...acc, formatterIter(keyNode.children, currentPath)]
        : [...acc, stringsMap[type](keyNode, currentPath)];
    }, [])
    .join('\n');

  return formatterIter(ast, null);
};
