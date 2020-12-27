import fs from 'fs';
import path from 'path';
import parse from './parsers.js';

export const isObject = (value) => (
  value === null
    ? false
    : value.constructor.name === 'Object'
);

export const parseFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  const rawData = fs.readFileSync(filePath, 'utf-8').toString();
  const fileExtension = path.extname(fullPath).slice(1);

  return parse(rawData, fileExtension);
};
