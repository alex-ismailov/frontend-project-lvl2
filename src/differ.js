import _ from 'lodash';

const {
  has, union, sortBy, isPlainObject, isEqual,
} = _;

/*
  diffTree is an object tree of nodes.
  The root node is called root, its children property contains an array of nodes
  which describes the difference between the values for the keys of the same name in
  the compared objects.
  * If the values by keys in both objects are not objects, but they are equal,
    then the node is marked with type 'repeated'.
  * If the key is found only in one of the objects,
    then the node is marked with the corresponding type: added or removed.
  * If the values by keys in both objects are not objects, and their values are not equal,
    then the node is marked with the 'update' type.
  * If both current key values are objects, then diffTree is evaluated recursively,
    and the resulting tree is placed in the children property of the node.
    The node is marked as 'nested'
*/
const getDiffTreeChildren = (obj1, obj2) => {
  const keysUnion = union(Object.keys(obj1), Object.keys(obj2));
  const sortedKeysUnion = sortBy(keysUnion);

  return sortedKeysUnion
    .flatMap((key) => {
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
