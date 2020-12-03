import fs from 'fs';
import _ from 'lodash';

const readFile = (filePath) => {
  // const fullFilePath = path.resolve(process.cwd(), filePath);
  // const data = fs.readFileSync(fullFilePath).toString();
  // return data;
  const data = fs.readFileSync(filePath).toString();
  return data;
};

const calculateDifference = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const allKeys = [...obj1Keys, ...obj2Keys].sort((a, b) => a.localeCompare(b, 'en'));
  /* Или вместо reduce использ. метод из lodash uniq() */
  // const uniqAllKeys = allKeys.reduce((acc, key) => (
  //   acc.includes(key)
  //     ? acc
  //     : [...acc, key]
  // ),
  // []);
  const uniqAllKeys = _.uniq(allKeys);

  const rows = uniqAllKeys.reduce((acc, key) => {
    if (obj1[key] && obj2[key]) {
      return obj1[key] === obj2[key]
        ? [...acc, `    ${key}: ${obj1[key]}`]
        : [...acc, `  - ${key}: ${obj1[key]}`, `  + ${key}: ${obj2[key]}`];
    }
    if (!obj2[key]) {
      return [...acc, `  - ${key}: ${obj1[key]}`];
    }
    return [...acc, `  + ${key}: ${obj2[key]}`];
  }, []).join('\n');

  const res = `{\n${rows}\n}`;
  return res;
};

export default (fullPath1, fullPath2) => {
  const rawData1 = readFile(fullPath1);
  const rawData2 = readFile(fullPath2);

  const data1 = JSON.parse(rawData1);
  const data2 = JSON.parse(rawData2);

  return calculateDifference(data1, data2);
};