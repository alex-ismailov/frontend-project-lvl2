import { parseFile } from './utils.js';
import getObjectsDiffAST from './differ.js';
import getFormatter from './formatters/index.js';

export default (file1Path, file2Path, formatStyle = 'stylish') => {
  const data1 = parseFile(file1Path);
  const data2 = parseFile(file2Path);

  const ast = getObjectsDiffAST(data1, data2);
  const formatter = getFormatter(formatStyle);

  return formatter(ast);
};
