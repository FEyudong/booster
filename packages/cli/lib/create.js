const path = require("path");
const fs = require("fs");
// 检测目录是否存在
const exists = fs.existsSync;
// 删除文件
const rm = require("rimraf").sync;
//询问cli输入参数
const ask = require("./ask");
// 命令行交互工具
const inquirer = require("inquirer");
// 命令行loading
const ora = require("ora");
// 输出增色
const chalk = require("chalk");
// 检测版本
const checkVersion = require("./check-version");

const generate = require("./generate");

const { writeFileTree } = require("./util/file");
const { platform } = require("os");

const spinner = ora();
async function create(projectName) {
  const cwd = process.cwd(); //当前运行node命令的目录
  const projectPath = path.resolve(cwd, projectName);
  // 假如当前已存在同名项目，询问是否覆盖
  if (exists(projectPath)) {
    const answers = await inquirer.prompt([
      {
        type: "confirm",
        message: "Target directory exists. Do you want to replace it?",
        name: "ok",
      },
    ]);
    if (answers.ok) {
      console.log(chalk.yellow("Deleting old project ..."));
      rm(projectPath);
      await create(projectName);
    }
  } else {
    // 收集用户输入选项
    const answers = await ask();

    // 检测版本
    await checkVersion();
    console.log(`✨  Creating project in ${chalk.yellow(projectPath)}.`);
    console.log(`🚀  Invoking generators...`);
    // console.log(answers);
    const pkg = require("../template/package.json");

    // 生成项目配置文件，app.config.json
    const appConfig = {};
    const { platform, reactRouterVersion } = answers;
    if (platform === "mobile") {
      pkg.devDependencies["postcss-pxtorem"] = "^6.0.0";
      pkg.dependencies["lib-flexible"] = "^0.3.2";
    } else if (platform === "pc") {
      pkg.dependencies["antd"] = "latest";
    }
    if (reactRouterVersion === "v5") {
      pkg.devDependencies["react-router"] = "5.1.2";
    } else if (reactRouterVersion === "v6") {
      pkg.dependencies["react-router"] = "^6.x";
    }

    appConfig.platform = platform;
    spinner.start("渲染模版文件");
    const filesTreeObj = await generate(answers);
    spinner.succeed();
    spinner.start("生成模版文件");
    await writeFileTree(projectPath, {
      ...filesTreeObj,
      "package.json": JSON.stringify(pkg, null, 2),
      "app.config.json": JSON.stringify(appConfig, null, 2),
    });
    spinner.succeed();
    console.log();
    console.log(
      `🎉  Successfully created project ${chalk.yellow(projectName)}.`
    );
    console.log(
        `👉  Get started with the following commands:\n\n` +
          chalk.cyan(` ${chalk.gray("$")} cd ${projectName}\n`) +
          chalk.cyan(` ${chalk.gray("$")} npm install or yarn\n`) +
          chalk.cyan(` ${chalk.gray("$")} npm run dev`)
      );
    console.log();
  }
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    spinner.fail("创建失败");
    console.error(chalk.red.dim("Error: " + err));
    process.exit(1);
  });
};
