import yaml from 'js-yaml';

export default {
  json: (data) => JSON.parse(data),
  yaml: (data) => yaml.safeLoad(data) ?? {},
};
