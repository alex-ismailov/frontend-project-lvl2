import _ from 'lodash';

const {
  has, union, sortBy, isPlainObject, isEqual,
} = _;

const getDiffTreeChildren = (obj1, obj2) => {
  const keysUnion = union(Object.keys(obj1), Object.keys(obj2));
  const sortedKeysUnion = sortBy(keysUnion);

  return sortedKeysUnion
    .map((key) => {
      if (isPlainObject(obj1[key]) && isPlainObject(obj2[key])) {
        return { key, type: 'nested', children: getDiffTreeChildren(obj1[key], obj2[key]) };
      }
      if (isEqual(obj1[key], obj2[key])) {
        return { key, type: 'unchanged', value: obj1[key] };
      }
      if (has(obj1, key) && has(obj2, key)) {
        return {
          key, type: 'updated', currentValue: obj2[key], previousValue: obj1[key],
        };
      }

      return has(obj1, key)
        ? { key, type: 'removed', value: obj1[key] }
        : { key, type: 'added', value: obj2[key] };
    });
};

export default (data1, data2) => ({
  type: 'root',
  children: getDiffTreeChildren(data1, data2),
});
