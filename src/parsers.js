import yaml from 'js-yaml';

export default (data, extension) => {
  switch (extension) {
    case 'json':
      return JSON.parse(data);
    case 'yaml':
      return yaml.safeLoad(data) ?? {};

    default:
      throw new Error(`Unknown file extension: ! ---> ${extension} <--- !`);
  }
};
