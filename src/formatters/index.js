import stylish from './stylish.js';

export default (type = 'stylish') => (ast) => {
  switch (type) {
    case 'stylish':
      return stylish(ast);

    default:
      throw new Error(`Unknown formatter type: ! ---> ${type} <--- !`);
  }
};
