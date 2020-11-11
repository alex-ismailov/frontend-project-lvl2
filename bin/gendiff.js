#!/usr/bin/env node

import commander from 'commander';
import app from '../src/index.js';

const argv = process.argv;

commander
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format [type]', 'output format');

commander.parse(argv);

console.log(app(argv));
