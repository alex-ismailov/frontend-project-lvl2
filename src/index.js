import differ from './differ.js';

export default (args) => {
  const [filepath1, filepath2] = process.argv.slice(2);

  return differ(filepath1, filepath2);
};