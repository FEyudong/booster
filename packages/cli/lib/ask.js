const { prompt } = require('inquirer')

const questions = [
  {
    name: 'platform',
    type: 'list',
    message: '您的web应用需要运行在哪个端呢?',
    choices: [{
      name: 'PC端',
      value: 'pc',
    }, {
      name: '移动端',
      value: 'mobile',
    }]
  },
  {
    name: 'reactRouterVersion',
    type: 'list',
    message: '选择react-router版本',
    choices: [{
      name: 'v5（推荐）',
      value: 'v5',
    }, {
      name: 'v6（对hook支持度较好,但api不够稳定）',
      value: 'v6',
    }]
  },
]

module.exports = function ask () {
  return prompt(questions)
}