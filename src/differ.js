import has from 'lodash/has.js';
import { isObject, getKeysUnion } from './utils.js';

/*
  diffTree is an array of nodes.
  The node describes the difference between the values for the keys of the same name in
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
const buildDiffTree = (obj1, obj2) => {
  const keysUnion = getKeysUnion(obj1, obj2);
  keysUnion.sort((a, b) => a.localeCompare(b, 'en'));

  return keysUnion
    .reduce((acc, key) => {
      if (has(obj1, key) && has(obj2, key)) {
        if (isObject(obj1[key]) && isObject(obj2[key])) {
          return [...acc, { name: key, type: 'parent', children: [...buildDiffTree(obj1[key], obj2[key])] }];
        }

        const currentAcc = obj1[key] === obj2[key]
          ? [...acc, { name: key, type: 'same', value: obj1[key] }]
          : [...acc, {
            name: key, type: 'updated', value: obj2[key], prevValue: obj1[key],
          }];

        return currentAcc;
      }

      return has(obj1, key)
        ? [...acc, { name: key, type: 'removed', value: obj1[key] }]
        : [...acc, { name: key, type: 'added', value: obj2[key] }];
    }, []);
};

export default buildDiffTree;
