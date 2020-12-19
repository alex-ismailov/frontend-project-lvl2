export default [
  {
    name: 'common',
    type: 'parent',
    children: [
      {
        name: 'follow',
        type: 'added',
        value: false,
      },
      {
        name: 'setting1',
        type: 'same',
        value: 'Value 1',
      },
      {
        name: 'setting2',
        type: 'removed',
        value: 200,
      },
      {
        name: 'setting3',
        type: 'updated',
        value: null,
        prevValue: true,
      },
      {
        name: 'setting4',
        type: 'added',
        value: 'blah blah',
      },
      {
        name: 'setting5',
        type: 'added',
        value: {
          key5: 'value5',
        },
      },
      {
        name: 'setting6',
        type: 'parent',
        children: [
          {
            name: 'doge',
            type: 'parent',
            children: [
              {
                name: 'wow',
                type: 'updated',
                value: 'so much',
                prevValue: '',
              },
            ],
          },
          {
            name: 'key',
            type: 'same',
            value: 'value',
          },
          {
            name: 'ops',
            type: 'added',
            value: 'vops',
          },
        ],
      },
    ],
  },
  {
    name: 'group1',
    type: 'parent',
    children: [
      {
        name: 'baz',
        type: 'updated',
        value: 'bars',
        prevValue: 'bas',
      },
      {
        name: 'foo',
        type: 'same',
        value: 'bar',
      },
      {
        name: 'nest',
        type: 'updated',
        value: 'str',
        prevValue: {
          key: 'value',
        },
      },
    ],
  },
  {
    name: 'group2',
    type: 'removed',
    value: {
      abc: 12345,
      deep: {
        id: 45,
      },
    },
  },
  {
    name: 'group3',
    type: 'added',
    value: {
      fee: 100500,
      deep: {
        id: {
          number: 45,
        },
      },
    },
  },
];
