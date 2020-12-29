import yaml from 'js-yaml';

export default (data, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    case 'yaml':
    case 'yml':
      return yaml.safeLoad(data) ?? {};

    default:
      throw new Error(`Unknown data format: ! ---> ${format} <--- !`);
  }
};
