CurrIndent (имею ввиду currentIndent) это подходящее сокращение?

Можно ди сделать вот такое обобщение:
const prefix = `${indent.repeat(depth)}${actionPrefix}`;
Затем уже собирать строку
const row = `${prefix}${diffNode.key}: ${value}`;

Допустим:

* ( звездочка ) это пробел.
# (решетка) это префикс для nested
‘+_‘ это префикс для added
‘-_’ это префикс для removed
‘^^’ это префикс для unchanged

Когда через root я погружаюсь на 1 уровень глубже, получается так
отступ 2 пробела

{
**##common: {

Далее  через nested я погружаюсь еще на 1 уровень глубже
отступ 4 пробела:

****??+_follow: false

Затем еще на 1 уровень глубже через nested:
отступ 6 пробела

****??+-setting6: {
******????##doge: {

Затем еще на 1 уровень глубже через nested:
отступ 8 пробелов:

********??????-_wow:
********??????+_wow: so much

итоге:

{
**##common: { // 2
****??+_follow: false // 6
****??+-setting6: { // 6
******????##doge: { // 10
********??????-_wow: // 14
********??????+_wow: so much // 14

root + 2 пробела; nested + 4 пробела




{ // 0
**##common: { // 2
****??+_follow: false // 6
****??+-setting6: { // 6
******????##doge: { // 10
********??????-_wow: // 14
********??????+_wow: so much // 14
******????##} // 10
****??+-} // 6
**##} // 2
**+_group3: { // 2
****??^^deep: { // 6
******????^^id: { // 10
********??????^^number: 45 // 14
******????^^} // 10
****??^^} // 6
**??} // 2
} // 0


0 – 2 – 6 – 10 – 14

************************************************
*  0 – 1 – 3 – 5 – 7  // root + 1 indent, nested + 2 indents  *
************************************************

deffTree:
{
  "type": "root",
  "children": [
    {
      "key": "common",
      "type": "nested",
      "children": [
        {
          "key": "follow",
          "type": "added",
          "value": false
        },
        {
          "key": "setting1",
          "type": "unchanged",
          "value": "Value 1"
        },
        {
          "key": "setting2",
          "type": "removed",
          "value": 200
        },
        {
          "key": "setting3",
          "type": "updated",
          "value": null,
          "valueBefore": true
        },
        {
          "key": "setting4",
          "type": "added",
          "value": "blah blah"
        },
        {
          "key": "setting5",
          "type": "added",
          "value": {
            "key5": "value5"
          }
        },
        {
          "key": "setting6",
          "type": "nested",
          "children": [
            {
              "key": "doge",
              "type": "nested",
              "children": [
                {
                  "key": "wow",
                  "type": "updated",
                  "value": "so much",
                  "valueBefore": ""
                }
              ]
            },
            {
              "key": "key",
              "type": "unchanged",
              "value": "value"
            },
            {
              "key": "ops",
              "type": "added",
              "value": "vops"
            }
          ]
        }
      ]
    },
    {
      "key": "group1",
      "type": "nested",
      "children": [
        {
          "key": "baz",
          "type": "updated",
          "value": "bars",
          "valueBefore": "bas"
        },
        {
          "key": "foo",
          "type": "unchanged",
          "value": "bar"
        },
        {
          "key": "nest",
          "type": "updated",
          "value": "str",
          "valueBefore": {
            "key": "value"
          }
        }
      ]
    },
    {
      "key": "group2",
      "type": "removed",
      "value": {
        "abc": 12345,
        "deep": {
          "id": 45
        }
      }
    },
    {
      "key": "group3",
      "type": "added",
      "value": {
        "fee": 100500,
        "deep": {
          "id": {
            "number": 45
          }
        }
      }
    }
  ]
}
