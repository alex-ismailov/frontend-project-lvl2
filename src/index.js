import { parseFile } from './utils.js';
import buildDiffTree from './differ.js';
import format from './formatters/index.js';

export default (filepath1, filepath2, formatStyle = 'stylish') => {
  const fileContent1 = parseFile(filepath1);
  const fileContent2 = parseFile(filepath2);
  const diffTree = buildDiffTree(fileContent1, fileContent2);

  return format(diffTree, formatStyle);
};
