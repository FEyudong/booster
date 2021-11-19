const execa = require('execa');
module.exports = function run (command, args) {
    if (!args) { [command, ...args] = command.split(/\s+/) }
    return execa(command, args)
  }