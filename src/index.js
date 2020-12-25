import { parseFile } from './utils.js';
import buildDiffTree from './differ.js';
import format from './formatters/index.js';

export default (file1Path, file2Path, formatStyle = 'stylish') => {
  const data1 = parseFile(file1Path);
  const data2 = parseFile(file2Path);
  const diffTree = buildDiffTree(data1, data2);

  return format(diffTree, formatStyle);
};
