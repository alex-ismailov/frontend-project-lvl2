import formatStylish from './stylish.js';
import formatPlain from './plain.js';

export default (diffTree, type) => {
  switch (type) {
    case 'stylish':
      return formatStylish(diffTree);
    case 'plain':
      return formatPlain(diffTree);
    case 'json':
      return JSON.stringify(diffTree);

    default:
      throw new Error(`Unknown formatter type: ${type}`);
  }
};
