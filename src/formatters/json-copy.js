const textsMap = {
  updated: 'Property was updated',
  added: 'Property was added',
  removed: 'Property was removed',
};

const buildDiffItem = (diffNode, previousPath) => {
  const {
    key, type, value, previousValue, currentValue,
  } = diffNode;

  const currentPath = previousPath === null ? key : `${previousPath}.${key}`;
  const message = textsMap[type];

  return type === 'updated'
    ? {
      type, message, path: currentPath, currentValue, previousValue,
    }
    : {
      type, message, path: currentPath, value,
    };
};

const nodeHandlers = {
  updated: (diffNode, previousPath) => buildDiffItem(diffNode, previousPath),
  added: (diffNode, previousPath) => buildDiffItem(diffNode, previousPath),
  removed: (diffNode, previousPath) => buildDiffItem(diffNode, previousPath),
  unchanged: () => [],
  nested: (diffNode, previousPath, buildDiffs) => {
    const currentPath = previousPath === null ? diffNode.key : `${previousPath}.${diffNode.key}`;
    return diffNode.children.flatMap((node) => buildDiffs(node, currentPath));
  },
  root: (diffNode, previousPath, buildDiffs) => (
    diffNode.children.flatMap((node) => buildDiffs(node, previousPath))
  ),
};

const buildDiffs = (diffNode, previousPath) => (
  nodeHandlers[diffNode.type](diffNode, previousPath, buildDiffs)
);

export default (diffTree) => {
  const differences = buildDiffs(diffTree, null);
  const report = {
    differences,
    updatedCount: differences.filter(({ type }) => type === 'updated').length,
    addedCount: differences.filter(({ type }) => type === 'added').length,
    removedCount: differences.filter(({ type }) => type === 'removed').length,
  };

  return JSON.stringify(report);
};
