const buildPath = (previousPath, currentPath) => {
  if (previousPath) {
    return `${previousPath}.${currentPath}`;
  }
  return currentPath;
};

const buildDiffs = (diffNode, previousPath) => {
  const {
    key, type, value, previousValue, currentValue, children,
  } = diffNode;
  switch (type) {
    case 'added':
    case 'removed':
      return {
        type, path: buildPath(previousPath, key), value,
      };
    case 'updated':
      return {
        type, path: buildPath(previousPath, key), currentValue, previousValue,
      };
    case 'unchanged':
      return [];
    case 'nested': {
      const path = buildPath(previousPath, key);
      return children.flatMap((node) => buildDiffs(node, path));
    }
    case 'root':
      return children.flatMap((node) => buildDiffs(node, previousPath));
    default:
      throw new Error(`Unknown diffNode type: ${type}`);
  }
};

export default (diffTree) => {
  const diffs = buildDiffs(diffTree, null);

  return JSON.stringify(diffs);
};
