#!/usr/bin/env node

import commander from 'commander';
import app from '../index.js';

const { argv } = process;

commander
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => console.log(app(filepath1, filepath2)));

commander.parse(argv);
