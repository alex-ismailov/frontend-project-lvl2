const buildDiffItem = (actionId, message, propPath, currentValue, previousValue) => {
  const diffItem = actionId === 'updated'
    ? {
      actionId, message, propPath, currentValue, previousValue,
    }
    : {
      actionId, message, propPath, currentValue,
    };

  return diffItem;
};

const textsMap = {
  updated: 'Property was updated',
  added: 'Property was added',
  removed: 'Property was removed',
};

const nodeHandlers = {
  updated: (diffNode, path) => buildDiffItem(
    diffNode.type, textsMap[diffNode.type], path, diffNode.currentValue, diffNode.previousValue,
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
  .flatMap((diffNode) => {
    const { type, key } = diffNode;
    const currentPath = pathBefore === null ? key : `${pathBefore}.${key}`;

    return type === 'nested'
      ? nodeHandlers[type](diffNode, currentPath, buildDiffItems)
      : nodeHandlers[type](diffNode, currentPath);
  });

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
