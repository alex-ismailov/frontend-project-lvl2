import stylish from './formatters/stylish.js';

export default (type = 'stylish') => (ast) => {
  switch (type) {
    case 'stylish':
      return stylish(ast);

    default:
      throw new Error(`Unknown formatter type: ! ---> ${type} <--- !`);
  }
};

// Это все красиво, конечно, но если передать не корректный
// аргумент type, то в stackTrace попадет инфа о следствиях ошибки, а
// не о ее причинах.
// Поэтому буду использовать switch
// const formattersMap = {
//   stylish: (ast) => stylish(ast),
//   stringStylish: (ast) => stringStylish(ast),
// };

// export default (type = 'stylish') => (ast) => (
//   formattersMap[type](ast)
// );
