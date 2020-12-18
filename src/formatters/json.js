const makeMessageItem = (actionId, message, path, value, prevValue) => {
  if (actionId === 'updated') {
    return {
      actionId,
      message,
      path,
      value,
      prevValue,
    };
  }

  return {
    actionId,
    message,
    path,
    value,
  };
};

const messageTextsMap = {
  updated: 'Property was updated',
  added: 'Property was added',
  removed: 'Property was removed',
};

const messagesMap = {
  updated: (keyNode, path) => makeMessageItem(keyNode.type, messageTextsMap[keyNode.type], path, keyNode.value, keyNode.preValue),
  added: (keyNode, path) => makeMessageItem(keyNode.type, messageTextsMap[keyNode.type], path, keyNode.value),
  removed: (keyNode, path) => makeMessageItem(keyNode.type, messageTextsMap[keyNode.type], path, keyNode.value),
  parent: (keyNode, path, makeMessagesIter) => {
    const messages = makeMessagesIter(keyNode.children, path);
    return makeMessageItem(keyNode.type, messageTextsMap[keyNode.type], path, messages);
    return makeMessagesIter(keyNode.children, path);
  },
};

const makeMessages = (ast) => {
  // console.log(ast);
  const makeMessagesIter = (currentAst, prevPath) => currentAst
    .reduce((acc, keyNode) => {
      const { type, name } = keyNode;
      const currentPath = prevPath === null ? name : `${prevPath}.${name}`;
      return type === 'parent'
        ? [...acc, ...messagesMap[type](keyNode, currentPath, makeMessagesIter)]
        // ? [...acc, ]
        : [...acc, messagesMap[type](keyNode, currentPath)];
    }, []);

  return makeMessagesIter(ast, null);
};


const makeReport = (messages, firstFilePath, secondFilePath) => {
  return messages;
};

export default (ast, firstFilePath, secondFilePath) => {
  const messages = makeMessages(ast);

  console.log(messages);

  const report = makeReport(messages, firstFilePath, secondFilePath);

  return JSON.stringify(report);
};




// => backup
// const makeMessages = (ast) => {
//   console.log(ast);
//   const makeMessagesIter = (currentAst, prevPath) => currentAst
//     .reduce((acc, keyNode) => {
//       const { type, name } = keyNode;
//       const currentPath = prevPath === null ? name : `${prevPath}.${name}`;
//       return type === 'parent'
//         ? [...acc, ...messagesMap[type](keyNode, currentPath, makeMessagesIter)]
//         : [...acc, messagesMap[type](keyNode, currentPath)];
//     }, []);

//   return makeMessagesIter(ast, null);
// };
