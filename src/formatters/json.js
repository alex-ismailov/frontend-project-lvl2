const buildDiffItem = (actionId, message, propPath, value, prevValue) => {
  const diffItem = actionId === 'updated'
    ? {
      actionId, message, propPath, value, prevValue,
    }
    : {
      actionId, message, propPath, value,
    };

  return diffItem;
};

const textsMap = {
  updated: 'Property was updated',
  added: 'Property was added',
  removed: 'Property was removed',
};

const differencesMap = {
  updated: (keyNode, path) => (
    buildDiffItem(keyNode.type, textsMap[keyNode.type], path, keyNode.value, keyNode.prevValue)
  ),
  added: (keyNode, path) => (
    buildDiffItem(keyNode.type, textsMap[keyNode.type], path, keyNode.value)
  ),
  removed: (keyNode, path) => (
    buildDiffItem(keyNode.type, textsMap[keyNode.type], path, keyNode.value)
  ),
  nested: (keyNode, path, buildDiffItemsIter) => (
    buildDiffItemsIter(keyNode.children, path)
  ),
};

const buildDiffItems = (diffTree) => {
  const buildDiffItemsIter = (currDiffTree, prevPath) => currDiffTree
    .reduce((acc, keyNode) => {
      const { type, key } = keyNode;
      const currentPath = prevPath === null ? key : `${prevPath}.${key}`;
      if (type === 'repeated') {
        return acc;
      }
      return type === 'nested'
        ? [...acc, ...differencesMap[type](keyNode, currentPath, buildDiffItemsIter)]
        : [...acc, differencesMap[type](keyNode, currentPath)];
    }, []);

  return buildDiffItemsIter(diffTree, null);
};

export default (diffTree) => {
  const differences = buildDiffItems(diffTree.children);
  const report = {
    differences,
    updatedCount: differences.filter(({ actionId }) => actionId === 'updated').length,
    addedCount: differences.filter(({ actionId }) => actionId === 'added').length,
    removedCount: differences.filter(({ actionId }) => actionId === 'removed').length,
  };

  return JSON.stringify(report);
};
