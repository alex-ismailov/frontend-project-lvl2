const makeMessageItem = (actionId, message, propPath, value, prevValue) => {
  if (actionId === 'updated') {
    return {
      actionId,
      message,
      propPath,
      value,
      prevValue,
    };
  }

  return {
    actionId,
    message,
    propPath,
    value,
  };
};

const textsMap = {
  updated: 'Property was updated',
  added: 'Property was added',
  removed: 'Property was removed',
};

const messagesMap = {
  updated: (keyNode, path) => (
    makeMessageItem(keyNode.type, textsMap[keyNode.type], path, keyNode.value, keyNode.prevValue)
  ),
  added: (keyNode, path) => (
    makeMessageItem(keyNode.type, textsMap[keyNode.type], path, keyNode.value)
  ),
  removed: (keyNode, path) => (
    makeMessageItem(keyNode.type, textsMap[keyNode.type], path, keyNode.value)
  ),
  parent: (keyNode, path, makeMessagesIter) => (
    makeMessagesIter(keyNode.children, path)
  ),
};

const makeMessages = (ast) => {
  const makeMessagesIter = (currentAst, prevPath) => currentAst
    .reduce((acc, keyNode) => {
      const { type, name } = keyNode;
      const currentPath = prevPath === null ? name : `${prevPath}.${name}`;
      if (type === 'same') {
        return acc;
      }
      return type === 'parent'
        ? [...acc, ...messagesMap[type](keyNode, currentPath, makeMessagesIter)]
        : [...acc, messagesMap[type](keyNode, currentPath)];
    }, []);

  return makeMessagesIter(ast, null);
};

const makeReport = (messages, firstFilePath, secondFilePath) => {
  const report = {
    firstFilePath,
    secondFilePath,
    messages,
    updatedCount: messages.filter(({ actionId }) => actionId === 'updated').length,
    addedCount: messages.filter(({ actionId }) => actionId === 'added').length,
    removedCount: messages.filter(({ actionId }) => actionId === 'removed').length,
  };

  return report;
};

export default (ast, firstFilePath, secondFilePath) => {
  const messages = makeMessages(ast);
  const report = makeReport(messages, firstFilePath, secondFilePath);

  return JSON.stringify(report);
};
