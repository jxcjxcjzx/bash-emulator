# bash-emulator

[![Build Status](https://travis-ci.org/trybash/bash-emulator.svg?branch=gh-pages)](https://travis-ci.org/trybash/bash-emulator)

[on npm](https://www.npmjs.com/package/bash-emulator)


## Usage

[Example usage](/index.html)

The module exports one function that can be required from another module.
Please use a tool like [webpack](https://webpack.github.io/) or [browserify](http://browserify.org/)
for bundling and minification in your own workflow.

`bashEmulator(state) -> emulator`
  - `state` an optional object to initialize the state. For shape [see below](#the-state-object).
  - Returns an `emulator` object

### `emulator`

- `run(command) -> Promise(output, code)`
  - `command` a bash command as string
  - Returns a `Promise` that resolves with an output string and an exit code.
    When the promise is resolved, `code` is always `0`.
    On rejection it's non-zero.
- `getDir() -> Promise(path)`
  - Returns a Promise that resolves with the current working directory
- `changeDir(path) -> Promise`
  - `path` relative path to set working directory to
  - Returns a Promise that resolves when change is done
- `read(filePath) -> Promise(content)`
  - `filePath` relative path of file to read
  - Returns a Promise that resolves with the content of the file
- `readDir(path) -> Promise([files])`
  - `path` optional, relative path of directory to read. Defaults to current directory.
  - Returns a Promise that resolves with an array listing all content of the directory
- `getStats(path) -> Promise(stats)`
  - `path` optional path of file or directory. Defaults to current directory.
  - Returns a Promise that resolves with a stats object. For now, only property is `lastEdited`.
- `createDir(path) -> Promise`
  - `path` relative, non-existed path for new directory
  - Returns a Promise that resolves when directory is created
- `write(filePath, content) -> Promise`
  - If file isn't empty, content is appended to it.
  - `filePath` path of file that should be written to. File doesn't have to exist.
  - Returns a Promise that resolves when writing is done
- `remove(path) -> Promise`
  - `path` path of file or directory to be deleting
  - Returns a Promise that resolves when deleting is done
- `getHistory() -> Promise([commands])`
  - Returns a Promise that resolves with a array containing all commands from the past
- `clearScreen() -> Promise`
  - Returns a Promise that resolves when clearing is done
- `getDimensions() -> Promise(dimensions)`
  - Returns a Promise with an dimensions object `{ x, y }`
- `commands`
  - An object with all commands that the emulator knows of
- `state`
  - [See below](#the-state-object)

### The `state` object

__It's not recommended to access the state directly. Use the above defined helper methods instead.__

- `history` an array of strings containing previous commands
- `user` name of the current user (defaults to `user`)
- `workingDirectory` a string containing the current working directory (defaults to `/home/user`)
- `fileSystem` an object that maps from absolute paths to directories or files.
  - Each value has a `type` property thats either `'dir'` or `'file'`
    and a `lastEdited` property containing a unix timestamp
  - Files also have a `content` property.
  - Default file system contains only directories for `/home/user`


### Storing state in `localStorage`

``` js
var state = JSON.parse(localStorage.bashEmulator || '{}')
var emulator = bashEmulator(state)
function saveState () {
  localStorage.bashEmulator = JSON.stringify(emulator.state)
}
emulator.run().then(saveState)
```


### Writing your own commands

You can modify the `commands` object of your emulator instance
to your liking.

To add a new command you need to implement the following API:

``` js
var emulator = bashEmulator()
emulator.commands.myCommand = function (env, args) {}
```

- `env` object with:
  - `output(string)` call to write a string to stdout
  - `error(string)` call to write a string to stderr
  - `exit(code)` call to exit command.
    - `code` integer to mark state of exit. Failure when not `0` (optional)
  - `system` reference to the emulator object.
- `args` array from command string. First element is command name.
- Optionally return object to register handlers for events:
  `{ input: fn, close: fn }`


### Using a custom file system

You can ignore the simple, built-in file system and overwrite all
required methods of your emulator instance with custom implementations.
The API of the methods are designed to work with asynchronous implementations as well.


## Development

- Setup project using `npm install`
- Make sure tests are running using `npm test`
- Build the `bash-emulator.min.js` file with `npm run build`


## Roadmap

- test coverage
- patterns for path expansion
- pipes
- basic logic
- simlinks
- readline shortcuts
- readline completion


### Built-in Commands

- `ls`
- `cd`
- `pwd`
- `history`
- `cat`
- `clear`
- `head`
- `tail`
- `mkdir`
- `mv`
- `cp`
- `rm`
- `touch`
- `echo`
- `wc`
- `sort`
- `uniq`
- `nl`
- `tac`
- `less`


## Browser Support

To support IE, please use a promise polyfill.
For example:
https://github.com/stefanpenner/es6-promise


## LICENSE

[MIT](/LICENSE)

