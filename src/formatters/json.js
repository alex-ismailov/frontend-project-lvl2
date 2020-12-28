const buildDiffItem = (actionId, message, propPath, value, valueBefore) => {
  const diffItem = actionId === 'updated'
    ? {
      actionId, message, propPath, value, valueBefore,
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
  updated: (diffNode, path) => buildDiffItem(
    diffNode.type, textsMap[diffNode.type], path, diffNode.value, diffNode.valueBefore,
  ),
  added: (diffNode, path) => buildDiffItem(
    diffNode.type, textsMap[diffNode.type], path, diffNode.value,
  ),
  removed: (diffNode, path) => buildDiffItem(
    diffNode.type, textsMap[diffNode.type], path, diffNode.value,
  ),
  nested: (diffNode, path, buildDiffItemsIter) => buildDiffItemsIter(diffNode.children, path),
};

const buildDiffItems = (diffTree) => {
  const buildDiffItemsIter = (currDiffTree, prevPath) => currDiffTree
    .reduce((acc, diffNode) => {
      const { type, key } = diffNode;
      const currentPath = prevPath === null ? key : `${prevPath}.${key}`;
      if (type === 'unchanged') {
        return acc;
      }
      return type === 'nested'
        ? [...acc, ...differencesMap[type](diffNode, currentPath, buildDiffItemsIter)]
        : [...acc, differencesMap[type](diffNode, currentPath)];
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
