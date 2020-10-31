#!/usr/bin/env node

import commander from 'commander';

commander
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0');

commander.parse(process.argv);