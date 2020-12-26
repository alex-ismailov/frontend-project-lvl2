import fs from 'fs';
import path from 'path';
import parseData from './parsers.js';

export const isObject = (value) => (
  value === null
    ? false
    : value.constructor.name === 'Object'
);

export const getKeysUnion = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const allKeys = [...obj1Keys, ...obj2Keys];
  const allKeysSet = new Set(allKeys);

  return Array.from(allKeysSet);
};

export const parseFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  const rawData = fs.readFileSync(filePath).toString();
  const fileExtension = path.extname(fullPath).slice(1);

  return parseData[fileExtension](rawData);
};
