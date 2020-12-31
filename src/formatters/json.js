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
  nested: (diffNode, previousPath, format) => {
    const currentPath = previousPath === null ? diffNode.key : `${previousPath}.${diffNode.key}`;
    return diffNode.children.flatMap((node) => format(node, currentPath));
  },
  root: (diffNode, previousPath, format) => (
    diffNode.children.flatMap((node) => format(node, previousPath))
  ),
};

const format = (diffNode, previousPath) => (
  nodeHandlers[diffNode.type](diffNode, previousPath, format)
);

export default (diffTree) => {
  const differences = format(diffTree, null);
  const report = {
    differences,
    updatedCount: differences.filter(({ type }) => type === 'updated').length,
    addedCount: differences.filter(({ type }) => type === 'added').length,
    removedCount: differences.filter(({ type }) => type === 'removed').length,
  };

  return JSON.stringify(report);
};
