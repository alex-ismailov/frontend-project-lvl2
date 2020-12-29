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
  nested: (diffNode, path, buildDiffItems) => buildDiffItems(diffNode, path),
  unchanged: () => [],
};

const buildDiffItems = (diffTree, pathBefore) => diffTree.children
  .reduce((acc, diffNode) => {
    const { type, key } = diffNode;
    const currentPath = pathBefore === null ? key : `${pathBefore}.${key}`;
    if (type === 'unchanged') {
      return acc;
    }
    return type === 'nested'
      ? [...acc, ...differencesMap[type](diffNode, currentPath, buildDiffItems)]
      : [...acc, differencesMap[type](diffNode, currentPath)];
  }, []);

export default (diffTree) => {
  const differences = buildDiffItems(diffTree, null);
  const report = {
    differences,
    updatedCount: differences.filter(({ actionId }) => actionId === 'updated').length,
    addedCount: differences.filter(({ actionId }) => actionId === 'added').length,
    removedCount: differences.filter(({ actionId }) => actionId === 'removed').length,
  };

  return JSON.stringify(report);
};
