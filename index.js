/* eslint-disable import/order */
import path from 'path';
import { readFile } from './src/utils.js';
import parsers from './src/parsers.js';
import getObjectsDiffAST from './src/differ.js';
import getFormatter from './src/formatter.js';

export default (file1Path, file2Path, outputFormat = 'stylish') => {
  const fullPath1 = path.resolve(process.cwd(), file1Path);
  const fullPath2 = path.resolve(process.cwd(), file2Path);

  const rawData1 = readFile(fullPath1);
  const rawData2 = readFile(fullPath2);

  const file1Extension = path.extname(fullPath1).slice(1);
  const file2Extension = path.extname(fullPath2).slice(1);

  const data1 = parsers[file1Extension](rawData1);
  const data2 = parsers[file2Extension](rawData2);

  const ast = getObjectsDiffAST(data1, data2);
  const formatter = getFormatter(outputFormat);

  return formatter(ast);
};
