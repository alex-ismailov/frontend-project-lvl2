import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

export default (diffTree, type) => {
  switch (type) {
    case 'stylish':
      return stylish(diffTree);
    case 'plain':
      return plain(diffTree);
    case 'json':
      return json(diffTree);

    default:
      throw new Error(`Unknown formatter type: ! ---> ${type} <--- !`);
  }
};
