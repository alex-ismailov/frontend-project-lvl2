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


// ******************************************************
// По логике поидее первое что мне надо сделать это проверить наличие ключей
// Если это так, то у меня неизбежно появляются вложенные if-ы, ключи есть но они могут быть либо примитвами
// либо объектами, помимо этого примитивы могут быть идентичными что тоже трубет if

if (has(obj1, key) && has(obj2, key)) {
  if (isPlainObject(obj1[key]) && isPlainObject(obj2[key])) {
    return { key, type: 'nested', children: getDiffTreeChildren(obj1[key], obj2[key]) };
  }
  if (isEqual(obj1[key], obj2[key])) {
    return { key, type: 'unchanged', value: obj1[key] };
  }
  return {
    key, type: 'updated', currentValue: obj2[key], previousValue: obj1[key],
  };
}

return has(obj1, key)
  ? { key, type: 'removed', value: obj1[key] }
  : { key, type: 'added', value: obj2[key] };

// ******************************************************

