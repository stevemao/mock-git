# mock-git [![Build Status: Linux](https://travis-ci.org/stevemao/mock-git.svg?branch=master)](https://travis-ci.org/stevemao/mock-git) [![Build Status: Windows](https://ci.appveyor.com/api/projects/status/76bg3fbqo2ox9s11/branch/master?svg=true)](https://ci.appveyor.com/project/stevemao/mock-git/branch/master)

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
const unmock = await mockGit(`console.log('${log}')`, 'bla');
let actual = shell.exec('git bla').stdout;
t.is(log + '\n', actual);

actual = shell.exec('git').stdout;
t.not(log + '\n', actual);

unmock();
actual = shell.exec('git bla').stdout;
t.not(log + '\n', actual);
```


## API

### mockGit(js, [command])

Returns a promise which resolves with an unmock function.

##### js

Type: `string`  

Nodejs code.

#### command

Type: `string`

EG: `'commit'`.

If omitted, it will mock the git binary.


## Related

- [mock-bin](https://github.com/stevemao/mock-bin) - Mock any executable binary


## License

MIT © [Steve Mao](https://github.com/stevemao)
