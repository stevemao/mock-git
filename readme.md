# mock-git [![Build Status](https://travis-ci.org/stevemao/mock-git.svg?branch=master)](https://travis-ci.org/stevemao/mock-git)

> Mock any git command

Useful for mocking tests that run git command, especially to fake edge cases and increase test coverage.


## Install

```
$ npm install --save-dev mock-git
```


## Usage

```js
const mockGit = require('mock-git');
const log = 'mocking git bla!';
const unmock = await m('bla', `console.log('${log}')`);
let actual = shell.exec('git bla').stdout;
t.is(log + '\n', actual);

actual = shell.exec('git').stdout;
t.not(log + '\n', actual);

unmock();
actual = shell.exec('git bla').stdout;
t.not(log + '\n', actual);
```


## API

### mockGit(command, js)

Returns a promise which resolves with an unmock function.

#### command

Type: `string`

EG: `'commit'`.

##### js

Type: `string`  

Nodejs code.


## Related

- [mock-bin](https://github.com/stevemao/mock-bin) - Mock any executable binary


## License

MIT © [Steve Mao](https://github.com/stevemao)
