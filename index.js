/* eslint-disable import/order */

import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default (file1Path, file2Path) => {
  // TODO: Кому делигоровать обработку относительных и абсолютных путей?
  // оставить ее в index.js или перенести в src/differ.js?
  const fullPath1 = path.resolve(__dirname, file1Path);
  const fullPath2 = path.resolve(__dirname, file2Path);

  return differ(fullPath1, fullPath2);
};
