import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

export default (ast, type) => {
  switch (type) {
    case 'stylish':
      return stylish(ast);
    case 'plain':
      return plain(ast);
    case 'json':
      return json(ast);

    default:
      throw new Error(`Unknown formatter type: ! ---> ${type} <--- !`);
  }
};
