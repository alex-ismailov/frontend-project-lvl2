import fs from 'fs';

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

export const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath).toString();
  } catch (error) {
    throw new Error(error);
  }
};
