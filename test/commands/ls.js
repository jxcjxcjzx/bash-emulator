var test = require('tape')
var bashEmulator = require('../../src')

test('ls', function (t) {
  t.plan(4)
  var testState = {
    history: [],
    user: 'test',
    workingDirectory: '/',
    fileSystem: {
      '/': {
        type: 'dir',
        lastEdited: Date.now()
      },
      '/etc': {
        type: 'dir',
        lastEdited: Date.now()
      },
      '/home': {
        type: 'dir',
        lastEdited: Date.now()
      },
      '/home/test': {
        type: 'dir',
        lastEdited: Date.now()
      },
      '/home/test/README': {
        type: 'file',
        lastEdited: Date.now(),
        content: 'read this first'
      }
    }
  }
  var emulator = bashEmulator(testState)
  emulator.run('ls').then(function (output) {
    t.equal(output, 'etc home', 'without args')
  })
  emulator.run('ls home').then(function (output) {
    t.equal(output, 'test', 'list dir')
  })
  emulator.run('ls home /').then(function (output) {
    var listing =
      '/:' +
      '\n' +
      'etc home' +
      '\n' +
      '\n' +
      'home:' +
      '\n' +
      'test'
    t.equal(output, listing, 'list multiple')
  })
  emulator.run('ls nonexistend').then(null, function (err) {
    t.equal(err, 'ls: cannot access nonexistend: No such file or directory', 'missing dir')
  })
})

