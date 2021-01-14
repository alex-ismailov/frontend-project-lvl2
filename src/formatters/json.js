const buildDiffs = (diffNode, previousPath) => {
  const {
    key, type, value, previousValue, currentValue, children,
  } = diffNode;
  const path = previousPath === null ? key : `${previousPath}.${key}`;
  switch (type) {
    case 'added':
    case 'removed':
      return {
        type, path, value,
      };
    case 'updated':
      return {
        type, path, currentValue, previousValue,
      };
    case 'unchanged':
      return [];
    case 'nested':
      return children.flatMap((node) => buildDiffs(node, path));
    case 'root':
      return children.flatMap((node) => buildDiffs(node, previousPath));
    default:
      throw new Error(`unknown diffNode type: ${type}`);
  }
};

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
