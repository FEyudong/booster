const { isBinaryFileSync } = require("isbinaryfile");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");

/**
 * @name 渲染文件
 * @param {*} filePath 文件路径
 * @param {*} ejsOptions ejs注入数据对象
 * @returns 文件内容
 */
function renderFile(filePath, ejsOptions = {}) {
  // 二进制文件直接返回
  if (isBinaryFileSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  const content = fs.readFileSync(filePath, "utf-8");

  //src目录下需要经过ejs动态编译
  if (/[\\/]src[\\/].+/.test(filePath)) {
    return ejs.render(content, ejsOptions);
  }
  // 其他文件，比如webpack的配置文件，直接读取返回
  return content;
}

/**
 * @name 生成项目文件
 * @param {*} answers 收集的问题
 * @returns 文件树 eg { '/path/a/b' : 文件内容 }
 */
async function generate(answers, targetDir) {
  const globby = require("globby");

  // 匹配脚手架文件夹所有文件
  const fileList = await globby(["**/*"], {
    cwd: path.resolve(__dirname, "../template"),
    gitignore: true,
    dot: true,
  });
  const { pageMode } = answers;
  const isMPA = pageMode === 'MPA';
  // ejs注入的模版变量
  const ejsData = {
    ...answers,
    projectDir: targetDir,
    pageName:'index'
  };
  // 生成文件树对象
  const filesTreeObj = {};
  fileList.forEach((oriPath) => {
    let targetPath = oriPath;
    const absolutePath = path.resolve(__dirname, "../template", oriPath);
  
    if (isMPA && /^src[\\/].+/.test(oriPath)) {
      // 针对多页场景，生成多页面模版
      const [dir, file] = oriPath.split(/[\\/]+/);
      ["index", "pageA", "pageB"].forEach((pageName) => {
        targetPath = `${dir}/pages/${pageName}/${file}`;
        filesTreeObj[targetPath] = renderFile(absolutePath, {
          ...ejsData,
          pageName,
        });
      });
    } else {
      const content = renderFile(absolutePath, ejsData);
      filesTreeObj[targetPath] = content;
    }
  });

  return filesTreeObj;
}

module.exports = generate;
