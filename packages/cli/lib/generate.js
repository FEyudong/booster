const { isBinaryFileSync } = require('isbinaryfile');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

/**
 * @name 渲染文件
 * @param {*} filePath 文件路径
 * @param {*} ejsOptions ejs注入数据对象
 * @returns 文件内容
 */
function renderFile (filePath,ejsOptions = {}) {
  // 二进制文件直接返回
  if (isBinaryFileSync(filePath)) {
    return fs.readFileSync(filePath)
  }
  const content = fs.readFileSync(filePath, 'utf-8')

  //src目录下需要经过ejs动态编译
  if(/[\\/]src[\\/].+/.test(filePath)){
    return ejs.render(content,ejsOptions)
  }
  // 其他文件，比如webpack的配置文件，直接读取返回
  return content
}

/**
 * @name 生成项目文件
 * @param {*} answers 收集的问题
 * @returns 文件树 eg { '/path/a/b' : 文件内容 }
 */
async function generate(answers){
  const globby = require('globby');

  // 匹配脚手架文件夹所有文件
  const files = await globby(['**/*'], { 
         cwd: path.resolve(__dirname,'../template'),
         gitignore:true,
         dot: true,
   })

   // 生成文件树对象
   const filesTreeObj = {};
   files.forEach((filePath)=>{
     filesTreeObj[filePath] = renderFile(path.resolve(__dirname,'../template',filePath),answers)
   })
   return filesTreeObj
}

module.exports = generate