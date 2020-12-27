const makeDiffItem = (actionId, message, propPath, value, prevValue) => (
  actionId === 'updated'
    ? {
      actionId, message, propPath, value, prevValue,
    }
    : {
      actionId, message, propPath, value,
    }
);

const textsMap = {
  updated: 'Property was updated',
  added: 'Property was added',
  removed: 'Property was removed',
};

const differencesMap = {
  updated: (keyNode, path) => (
    makeDiffItem(keyNode.type, textsMap[keyNode.type], path, keyNode.value, keyNode.prevValue)
  ),
  added: (keyNode, path) => (
    makeDiffItem(keyNode.type, textsMap[keyNode.type], path, keyNode.value)
  ),
  removed: (keyNode, path) => (
    makeDiffItem(keyNode.type, textsMap[keyNode.type], path, keyNode.value)
  ),
  parent: (keyNode, path, makeDiffItemsIter) => (
    makeDiffItemsIter(keyNode.children, path)
  ),
};

const makeDiffItems = (diffTree) => {
  const makeDiffItemsIter = (currentAst, prevPath) => currentAst
    .reduce((acc, keyNode) => {
      const { type, name } = keyNode;
      const currentPath = prevPath === null ? name : `${prevPath}.${name}`;
      if (type === 'same') {
        return acc;
      }
      return type === 'parent'
        ? [...acc, ...differencesMap[type](keyNode, currentPath, makeDiffItemsIter)]
        : [...acc, differencesMap[type](keyNode, currentPath)];
    }, []);

  return makeDiffItemsIter(diffTree, null);
};

export default (diffTree) => {
  const differences = makeDiffItems(diffTree);
  const report = {
    differences,
    updatedCount: differences.filter(({ actionId }) => actionId === 'updated').length,
    addedCount: differences.filter(({ actionId }) => actionId === 'added').length,
    removedCount: differences.filter(({ actionId }) => actionId === 'removed').length,
  };

  return JSON.stringify(report);
};
