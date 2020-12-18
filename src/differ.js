import has from 'lodash/has';
import { isObject, getKeysUnion } from './utils.js';

/*
AST представляет из себя массив узлов.
Узел описывает разницу между значениями по одноименным ключам в сравниваемых объектах.
* Если значения по ключам в обоих объектах не являются объектами, но они равны, то
  узел помечается типом 'same'.
* Если ключ встречается только в одном из объектов, то узел помечается соответсвующим типом:
  added или removed.
* Если значения по ключам в обоих объектах не являются объектами, и их значения не равны, то
  узел помечается типом 'updated'.
* Если оба текущих значения по ключу являются объектами, то AST вычисляется рекурсивно,
  а полученное дерево помещается в св-во узла children
*/

const getObjectsDiffAST = (obj1, obj2) => {
  const keysUnion = getKeysUnion(obj1, obj2);
  keysUnion.sort((a, b) => a.localeCompare(b, 'en'));

  return keysUnion
    .reduce((acc, key) => {
      if (has(obj1, key) && has(obj2, key)) {
        if (isObject(obj1[key]) && isObject(obj2[key])) {
          return [...acc, { name: key, type: 'parent', children: [...getObjectsDiffAST(obj1[key], obj2[key])] }];
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

export default getObjectsDiffAST;
