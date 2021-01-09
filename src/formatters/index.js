import formatStylish from './stylish.js';
import formatPlain from './plain.js';
import formatJson from './json.js';

export default (diffTree, type) => {
  switch (type) {
    case 'stylish':
      return formatStylish(diffTree);
    case 'plain':
      return formatPlain(diffTree);
    case 'json':
      return formatJson(diffTree);

    default:
      throw new Error(`Unknown formatter type: ${type}`);
  }
};
