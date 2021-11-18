#!/usr/bin/env node
const program = require('commander');

program
  .version(require("../package").version)
  .usage("<command> [options]");
  
  
  program.command("create <project-name>")
  .description("创建一个新的项目")
  .action((projectName)=>{
    require('../lib/create')(projectName)
  })

  program.parse(process.argv);  
