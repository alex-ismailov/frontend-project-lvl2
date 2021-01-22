import _ from 'lodash';

// const getDiffTreeChildren = (obj1, obj2) => {
//   const keysUnion = _.union(Object.keys(obj1), Object.keys(obj2));
//   const sortedKeysUnion = _.sortBy(keysUnion);

//   return sortedKeysUnion
//     .map((key) => {
//       if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
//         return { key, type: 'nested', children: getDiffTreeChildren(obj1[key], obj2[key]) };
//       }
//       if (_.isEqual(obj1[key], obj2[key])) {
//         return { key, type: 'unchanged', value: obj1[key] };
//       }
//       if (_.has(obj1, key) && _.has(obj2, key)) {
//         return {
//           key, type: 'updated', currentValue: obj2[key], previousValue: obj1[key],
//         };
//       }

//       return _.has(obj1, key)
//         ? { key, type: 'removed', value: obj1[key] }
//         : { key, type: 'added', value: obj2[key] };
//     });
// };

// const getDiffTreeChildren = (obj1, obj2) => {
//   const keysUnion = _.union(Object.keys(obj1), Object.keys(obj2));
//   const sortedKeysUnion = _.sortBy(keysUnion);

//   return sortedKeysUnion
//     .map((key) => {
//       if (_.has(obj1, key) && _.has(obj2, key)) {
//         if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
//           return { key, type: 'nested', children: getDiffTreeChildren(obj1[key], obj2[key]) };
//         }
//         if (_.isEqual(obj1[key], obj2[key])) {
//           return { key, type: 'unchanged', value: obj1[key] };
//         }
//         return {
//           key, type: 'updated', currentValue: obj2[key], previousValue: obj1[key],
//         };
//       }

//       return _.has(obj1, key)
//         ? { key, type: 'removed', value: obj1[key] }
//         : { key, type: 'added', value: obj2[key] };
//     });
// };

const getDiffTreeChildren = (obj1, obj2) => {
  const keysUnion = _.union(Object.keys(obj1), Object.keys(obj2));
  const sortedKeysUnion = _.sortBy(keysUnion);

  return sortedKeysUnion
    .map((key) => {
      if (_.has(obj1, key) && !_.has(obj2, key)) {
        return { key, type: 'removed', value: obj1[key] };
      }
      if (!_.has(obj1, key) && _.has(obj2, key)) {
        return { key, type: 'added', value: obj2[key] };
      }
      if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
        return { key, type: 'nested', children: getDiffTreeChildren(obj1[key], obj2[key]) };
      }

      return _.isEqual(obj1[key], obj2[key])
        ? { key, type: 'unchanged', value: obj1[key] }
        : {
          key, type: 'updated', currentValue: obj2[key], previousValue: obj1[key],
        };
    });
};

export default (data1, data2) => ({
  type: 'root',
  children: getDiffTreeChildren(data1, data2),
});
