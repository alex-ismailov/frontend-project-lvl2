import has from 'lodash/has.js';
import union from 'lodash/union.js';
import keys from 'lodash/keys.js';
import sortBy from 'lodash/sortBy.js';
import identity from 'lodash/identity.js';
import isPlainObject from 'lodash/isPlainObject.js';

/*
  diffTree is an object tree of nodes.
  The root node is called root, its children property contains an array of nodes
  which describes the difference between the values for the keys of the same name in
  the compared objects.
  * If the values by keys in both objects are not objects, but they are equal, then
    the node is marked eith type 'same'.
  * If the key is found only in one of the objects,
    then the node is marked with the corresponding type: added or removed.
  * If the values by keys in both objects are not objects, and their values are not equal,
    then the node is marked with the 'update' type.
  * If both current key values are objects, then diffTree is evaluated recursively,
    and the resulting tree is placed in children property of node.
*/
const buildDiffTree = (data1, data2) => {
  const getDiffTreeChildren = (obj1, obj2) => {
    const keysUnion = union(keys(obj1), keys(obj2));
    const sortedKeysUnion = sortBy(keysUnion, identity);

    return sortedKeysUnion
      .flatMap((key) => {
        if (isPlainObject(obj1[key]) && isPlainObject(obj2[key])) {
          return { key, type: 'parent', children: [...getDiffTreeChildren(obj1[key], obj2[key])] };
        }

        if (has(obj1, key) && has(obj2, key)) {
          const currentAcc = obj1[key] === obj2[key]
            ? { key, type: 'same', value: obj1[key] }
            : {
              key, type: 'updated', value: obj2[key], prevValue: obj1[key],
            };

          return currentAcc;
        }

        return has(obj1, key)
          ? { key, type: 'removed', value: obj1[key] }
          : { key, type: 'added', value: obj2[key] };
      });
  };

  return {
    name: 'root',
    type: 'root',
    children: getDiffTreeChildren(data1, data2),
  };
};

export default buildDiffTree;
