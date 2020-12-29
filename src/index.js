import fs from 'fs';
import path from 'path';
import buildDiffTree from './differ.js';
import format from './formatters/index.js';
import parse from './parsers.js';

const parseFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  const rawData = fs.readFileSync(fullPath, 'utf-8').toString();
  const fileExtension = path.extname(fullPath).slice(1);

  return parse(rawData, fileExtension);
};

export default (filepath1, filepath2, formatStyle = 'stylish') => {
  const fileContent1 = parseFile(filepath1);
  const fileContent2 = parseFile(filepath2);
  const diffTree = buildDiffTree(fileContent1, fileContent2);

  return format(diffTree, formatStyle);
};
