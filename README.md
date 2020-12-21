# Difference calculator

![tiranozavr](https://github.com/alex-ismailov/git-imgs/blob/master/tiranozavr-left-right-without-bg-500x294.png)

[![Github-Actions](https://github.com/alex-ismailov/frontend-project-lvl2/workflows/Node%20CI/badge.svg)](https://github.com/alex-ismailov/frontend-project-lvl2/actions) [![Maintainability](https://api.codeclimate.com/v1/badges/82fcb720295747438972/maintainability)](https://codeclimate.com/github/alex-ismailov/frontend-project-lvl2/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/82fcb720295747438972/test_coverage)](https://codeclimate.com/github/alex-ismailov/frontend-project-lvl2/test_coverage)

### Difference calculator a program that determines the difference between two data structures.
---

Utility features:

* Support for different input formats: yaml, json
* Generating a report in plain text, stylish and json format

### Usage
---

```javascript
# plain format
$ gendiff --format plain path/to/file.yml another/path/file.json

Property 'common.follow' was added with value: false
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group2' was removed

# stylish format
$ gendiff filepath1.json filepath2.json

{
  + follow: false
    setting1: Value 1
  - setting2: 200
  - setting3: true
  + setting3: {
        key: value
    }
  + setting4: blah blah
  + setting5: {
        key5: value5
    }
}
```

### Demo
---

#### step 8
[![asciicast](https://asciinema.org/a/380066.svg)](https://asciinema.org/a/380066)

---

#### step 7
[![asciicast](https://asciinema.org/a/379673.svg)](https://asciinema.org/a/379673)

---

#### step 6
[![asciicast](https://asciinema.org/a/379450.svg)](https://asciinema.org/a/379450)

---

#### step 5
[![asciicast](https://asciinema.org/a/378306.svg)](https://asciinema.org/a/378306)

---

#### step 3
[![asciicast](https://asciinema.org/a/377334.svg)](https://asciinema.org/a/377334)

---
