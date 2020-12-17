import stylish from './stylish.js';
import plain from './plain.js';

export default (type = 'stylish') => (ast) => {
  switch (type) {
    case 'stylish':
      return stylish(ast);
    case 'plain':
      return plain(ast);

    default:
      throw new Error(`Unknown formatter type: ! ---> ${type} <--- !`);
  }
};
