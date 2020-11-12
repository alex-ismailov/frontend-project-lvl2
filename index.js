/* eslint-disable import/order */

import differ from './src/differ.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (file1Path, file2Path) => {
  // TODO: Кому делигоровать обработку относительных и абсолютных путей?
  // оставить ее в index.js или перенести в src/differ.js?
  const fullPath1 = path.resolve(__dirname, file1Path);
  const fullPath2 = path.resolve(__dirname, file2Path);

  return differ(fullPath1, fullPath2);
};
