#!/usr/bin/env node

import commander from 'commander';
import getDiff from '../index.js';

commander
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2) => console.log(getDiff(filepath1, filepath2, commander.format)));

commander.parse(process.argv);
