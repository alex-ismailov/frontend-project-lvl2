#!/usr/bin/env node

import commander from 'commander';

commander
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format [type]', 'output format')

commander.parse(process.argv);
