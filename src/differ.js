import fs from 'fs';
import path from 'path';

const readFile = (filePath) => {
  const fullFilePath = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(fullFilePath).toString();
  return data;
};

/* Вариант на строках */
const calculateDiffOnStrings = (data1, data2) => {
  const data1Keys = Object.keys(data1);
  const data2Keys = Object.keys(data2);
  const datasKeys = [...data1Keys, ...data2Keys];

  const datasKeysSet = new Set(datasKeys);
  const uniqDatasKeys = Array.from(datasKeysSet).sort((a, b) => a.localeCompare(b, 'en'));

  const rows = uniqDatasKeys.reduce((acc, key) => {
    if (data1Keys.includes(key) && data2Keys.includes(key)) {
      return data1[key] === data2[key]
        ? [...acc, `    ${key}: ${data1[key]}`]
        : [...acc, `  - ${key}: ${data1[key]}`, `  + ${key}: ${data2[key]}`];
    }
    if (data1Keys.includes(key)) {
      return [...acc, `  - ${key}: ${data1[key]}`];
    }
    return [...acc, `  + ${key}: ${data2[key]}`];
  }, []).join('\n');

  const res = `{\n${rows}\n}`;

  return res;
};

const app = (filePath1, filePath2) => {
  const rawData1 = readFile(filePath1);
  const rawData2 = readFile(filePath2);

  const data1 = JSON.parse(rawData1);
  const data2 = JSON.parse(rawData2);

  // построение итоговой структуры diff пока что перенес в отдельную
  // абстракцию calculateDiffOnStrings, так не до конца понимаю,
  // что она из себя представляет, и как и ее вычислять.
  const diff1 = calculateDiffOnStrings(data1, data2);

  return diff1;
};

export default app;

/* ********* my tests ************** */
// const file1Path = 'myTests/file1.json';
// const file2Path = 'myTests/file2.json';

// console.log(app(file1Path, file2Path));
