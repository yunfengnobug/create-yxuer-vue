/**
 * create-yxuer-vue - Vue3 + TypeScript + Vite + Ant Design Vue 脚手架生成器
 *
 * 这是脚手架的主入口文件，负责：
 * 1. 解析命令行参数
 * 2. 与用户交互收集项目配置信息
 * 3. 根据用户选择复制和配置项目模板
 * 4. 生成最终的项目结构
 */

// ============================= 模块导入 =============================
import fs from 'node:fs' // Node.js 文件系统模块，用于文件和目录操作
import path from 'node:path' // Node.js 路径模块，用于处理文件路径
import { fileURLToPath } from 'node:url' // URL 转换模块，用于 ES 模块中获取 __dirname
import prompts from 'prompts' // 命令行交互提示库，用于收集用户输入
import minimist from 'minimist' // 命令行参数解析库
import { blue, cyan, green, lightGreen, lightRed, magenta, red, reset, yellow } from 'kolorist' // 终端颜色美化库

// ============================= 全局常量 =============================

/**
 * 获取当前文件的目录路径
 * 在 ES 模块中，__dirname 不可用，需要通过 fileURLToPath 和 import.meta.url 来获取
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 默认项目名称
 * 当用户没有指定项目名称时使用此默认值
 */
const defaultProjectName = 'yxuer-vue-project'

/**
 * 解析命令行参数
 * 使用 minimist 解析用户在命令行中传递的参数
 *
 * 参数说明：
 * - string: ['_'] - 将未命名的参数作为字符串处理
 * - boolean: ['help'] - help 参数作为布尔值处理
 * - alias: { h: 'help' } - 将 -h 作为 --help 的别名
 */
const argv = minimist(process.argv.slice(2), {
  string: ['_'],
  boolean: ['help'],
  alias: { h: 'help' },
})

// ============================= 帮助信息 =============================

/**
 * 显示帮助信息
 * 当用户使用 -h 或 --help 参数时，显示脚手架的使用说明
 * 然后退出程序（exit code 0 表示正常退出）
 */
if (argv.help) {
  console.log(`
${blue('create-yxuer-vue')} - 基于 Vue3 + TypeScript + Vite + Ant Design Vue 的企业级前端脚手架

${yellow('使用方法:')}
  ${green('npm create yxuer-vue@latest')} [项目名称] [选项]
  ${green('pnpm create yxuer-vue')} [项目名称] [选项]
  ${green('yarn create yxuer-vue')} [项目名称] [选项]

${yellow('选项:')}
  -h, --help     显示帮助信息

${yellow('示例:')}
  ${green('npm create yxuer-vue@latest my-app')}
  ${green('pnpm create yxuer-vue my-app')}
`)
  process.exit(0)
}

// ============================= 工具函数 =============================

/**
 * 格式化目标目录路径
 * 移除路径前后的空格以及末尾的斜杠
 *
 * @param {string} targetDir - 原始目标目录路径
 * @returns {string} 格式化后的目录路径
 *
 * @example
 * formatTargetDir('  my-app/  ') // 返回 'my-app'
 * formatTargetDir('my-app///') // 返回 'my-app'
 */
function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

/**
 * 检查目录是否为空
 * 如果目录不存在、没有文件、或只包含 .git 目录，则认为是空的
 *
 * @param {string} path - 要检查的目录路径
 * @returns {boolean} 如果目录为空或不存在返回 true，否则返回 false
 *
 * @example
 * isEmpty('/path/to/empty/dir') // 返回 true
 * isEmpty('/path/to/dir/with/.git') // 返回 true（只有.git也算空）
 * isEmpty('/path/to/dir/with/files') // 返回 false
 */
function isEmpty(path) {
  // 如果目录不存在，认为是空的
  if (!fs.existsSync(path)) {
    return true
  }
  // 读取目录中的所有文件和子目录
  const files = fs.readdirSync(path)
  // 如果没有文件，或只有一个 .git 目录，认为是空的
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

/**
 * 清空目录中的所有文件和子目录
 * 保留 .git 目录（如果存在）
 *
 * @param {string} dir - 要清空的目录路径
 *
 * @example
 * emptyDir('/path/to/dir') // 删除目录中除 .git 外的所有内容
 */
function emptyDir(dir) {
  // 如果目录不存在，直接返回
  if (!fs.existsSync(dir)) {
    return
  }
  // 遍历目录中的所有文件和子目录
  for (const file of fs.readdirSync(dir)) {
    // 跳过 .git 目录，保留版本控制信息
    if (file === '.git') {
      continue
    }
    // 递归删除文件或目录，force: true 表示强制删除
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

/**
 * 复制文件或目录
 * 根据源路径的类型（文件或目录）选择合适的复制方法
 *
 * @param {string} src - 源文件或目录的路径
 * @param {string} dest - 目标文件或目录的路径
 * @throws {Error} 如果复制失败则抛出错误
 *
 * @example
 * copy('/path/to/file.txt', '/path/to/dest.txt') // 复制文件
 * copy('/path/to/dir', '/path/to/dest-dir') // 复制目录
 */
function copy(src, dest) {
  try {
    // 获取源路径的状态信息
    const stat = fs.statSync(src)
    // 如果是目录，使用 copyDir 函数递归复制
    if (stat.isDirectory()) {
      copyDir(src, dest)
    } else {
      // 如果是文件，直接复制
      fs.copyFileSync(src, dest)
    }
  } catch (error) {
    // 复制失败时显示错误信息并重新抛出错误
    console.error(`${red('✖')} 复制文件失败: ${src} -> ${dest}`)
    throw error
  }
}

/**
 * 递归复制目录及其所有内容
 *
 * @param {string} srcDir - 源目录路径
 * @param {string} destDir - 目标目录路径
 *
 * @example
 * copyDir('/path/to/source', '/path/to/destination')
 */
function copyDir(srcDir, destDir) {
  // 创建目标目录，recursive: true 表示递归创建父目录
  fs.mkdirSync(destDir, { recursive: true })
  // 遍历源目录中的所有文件和子目录
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    // 递归调用 copy 函数处理每个文件或子目录
    copy(srcFile, destFile)
  }
}

/**
 * 从用户代理字符串中解析包管理器信息
 * npm_config_user_agent 环境变量包含了执行命令的包管理器信息
 *
 * @param {string} userAgent - 用户代理字符串，如 "npm/8.1.0 node/v16.13.0"
 * @returns {{name: string, version: string} | undefined} 包管理器的名称和版本，如果无法解析则返回 undefined
 *
 * @example
 * pkgFromUserAgent('npm/8.1.0 node/v16.13.0')
 * // 返回 { name: 'npm', version: '8.1.0' }
 *
 * pkgFromUserAgent('pnpm/7.0.0 node/v16.13.0')
 * // 返回 { name: 'pnpm', version: '7.0.0' }
 */
function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined
  // 获取第一个部分，如 "npm/8.1.0"
  const pkgSpec = userAgent.split(' ')[0]
  // 按 "/" 分割得到名称和版本
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0], // 包管理器名称，如 "npm", "pnpm", "yarn"
    version: pkgSpecArr[1], // 包管理器版本号
  }
}

/**
 * 写入文件并进行变量替换
 * 用于根据用户输入替换模板文件中的占位符
 *
 * @param {string} filePath - 要写入的文件路径
 * @param {string} content - 文件内容
 * @param {Object} replacements - 替换规则对象，键为要替换的模式，值为替换后的内容
 *
 * @example
 * writeFileWithReplace(
 *   './config.js',
 *   'const APP_ID = "__APP_ID__"',
 *   { '__APP_ID__': 'my-app-123' }
 * )
 * // 文件中的 __APP_ID__ 会被替换为 my-app-123
 */
function writeFileWithReplace(filePath, content, replacements) {
  let result = content
  // 遍历所有替换规则
  for (const [key, value] of Object.entries(replacements)) {
    // 使用正则表达式全局替换（g 标志表示替换所有匹配项）
    result = result.replace(new RegExp(key, 'g'), value)
  }
  // 将替换后的内容写入文件
  fs.writeFileSync(filePath, result, 'utf-8')
}

// ============================= 主函数 =============================

/**
 * 脚手架初始化主函数
 * 负责整个项目创建流程：
 * 1. 解析命令行参数
 * 2. 与用户交互收集项目配置
 * 3. 创建和配置项目目录
 * 4. 复制模板文件
 * 5. 根据用户选择定制项目
 * 6. 显示后续操作指引
 */
async function init() {
  // 从命令行参数中获取目标目录（第一个位置参数）
  const argTargetDir = argv._[0]
  // 如果没有提供目录名，使用默认项目名称
  let targetDir = argTargetDir || defaultProjectName

  // 显示欢迎信息
  console.log()
  console.log(`${blue('🚀 欢迎使用 create-yxuer-vue 脚手架！')}`)
  console.log()

  // 用于存储用户的交互输入结果
  let result = {}

  // ============================= 用户交互收集配置 =============================
  try {
    // 使用 prompts 库与用户进行交互式问答
    result = await prompts(
      [
        // ============================= 1. 询问项目名称 =============================
        {
          // 如果命令行已提供项目名称，则跳过此问题（type 为 null）
          type: argTargetDir ? null : 'text',
          name: 'projectName',
          message: reset('项目名称：'),
          initial: defaultProjectName,
          // 当用户输入时实时更新 targetDir
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultProjectName
          },
        },

        // ============================= 2. 处理目录冲突 =============================
        {
          // 只有当目标目录存在且不为空时才显示此问题
          type: () => (!fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'select'),
          name: 'overwrite',
          message: () =>
            (targetDir === '.' ? '当前目录' : `目标目录 "${targetDir}"`) +
            ` 不为空。请选择如何继续：`,
          choices: [
            {
              title: '移除已存在的文件并继续',
              value: 'yes',
            },
            {
              title: '取消操作',
              value: 'no',
            },
            {
              title: '忽略文件并继续',
              value: 'ignore',
            },
          ],
        },

        // ============================= 3. 取消操作检查器 =============================
        {
          // 如果用户选择取消，抛出错误并终止流程
          type: (_, { overwrite } = {}) => {
            if (overwrite === 'no') {
              throw new Error(red('✖') + ' 操作已取消')
            }
            return null
          },
          name: 'overwriteChecker',
        },

        // ============================= 4. 询问项目标题 =============================
        {
          type: 'text',
          name: 'projectTitle',
          message: reset('项目标题（显示在浏览器标签）：'),
          initial: '深瞳子应用',
        },

        // ============================= 5. 询问应用 ID =============================
        {
          type: 'text',
          name: 'appId',
          message: reset('应用 ID：'),
          initial: 'YXUER_DEMO',
        },

        // ============================= 6. 询问路由模式 =============================
        {
          type: 'select',
          name: 'pathMode',
          message: reset('路由模式：'),
          choices: [
            { title: 'Hash 模式（推荐）', value: 'hash' }, // hash 模式不需要服务器配置
            { title: 'History 模式', value: 'history' }, // history 模式需要服务器支持
          ],
          initial: 0, // 默认选择第一个选项（Hash 模式）
        },

        // ============================= 7. 询问是否需要富文本编辑器 =============================
        {
          type: 'select',
          name: 'needEditor',
          message: reset('是否需要富文本编辑器（AIEditor）？'),
          choices: [
            { title: '是', value: true },
            { title: '否', value: false },
          ],
          initial: 1, // 默认选择第二个选项（否）
        },

        // ============================= 8. 询问是否需要文件上传工具 =============================
        {
          type: 'select',
          name: 'needUpload',
          message: reset('是否需要文件上传工具（七牛云）？'),
          choices: [
            { title: '是', value: true },
            { title: '否', value: false },
          ],
          initial: 1, // 默认选择第二个选项（否）
        },
      ],
      {
        // 当用户按 Ctrl+C 取消操作时的回调
        onCancel: () => {
          throw new Error(red('✖') + ' 操作已取消')
        },
      },
    )
  } catch (cancelled) {
    // 捕获用户取消操作或其他错误
    console.log(cancelled.message)
    return
  }

  // ============================= 解构用户输入结果 =============================
  const { projectName, overwrite, projectTitle, appId, pathMode, needEditor, needUpload } = result

  // 获取项目根目录的绝对路径
  const root = path.join(process.cwd(), targetDir)

  // ============================= 处理目录创建和覆盖 =============================
  if (overwrite === 'yes') {
    // 如果用户选择覆盖，清空目录中的所有文件（保留 .git）
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    // 如果目录不存在，创建新目录
    fs.mkdirSync(root, { recursive: true })
  }
  // 如果 overwrite === 'ignore'，则不做任何处理，直接在现有文件上覆盖

  console.log()
  console.log(`${green('✓')} 正在创建项目到 ${cyan(root)}`)

  // ============================= 获取模板路径 =============================
  // template 目录位于当前文件的上级目录
  const templateDir = path.resolve(__dirname, '../template')

  // ============================= 定义文件写入函数 =============================
  /**
   * 写入文件的辅助函数
   * @param {string} file - 文件名（相对于项目根目录）
   * @param {string} [content] - 文件内容，如果提供则直接写入，否则从模板复制
   */
  const write = (file, content) => {
    const targetPath = path.join(root, file)
    if (content) {
      // 如果提供了内容，直接写入文件
      fs.writeFileSync(targetPath, content)
    } else {
      // 否则从模板目录复制文件
      copy(path.join(templateDir, file), targetPath)
    }
  }

  // ============================= 复制基础文件 =============================
  // 读取模板目录中的所有文件
  const files = fs.readdirSync(templateDir)
  // 过滤掉 package.json（后面单独处理），复制其他所有文件
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file)
  }

  // ============================= 处理 package.json =============================
  try {
    // 读取模板中的 package.json
    const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, 'package.json'), 'utf-8'))
    // 设置项目名称为用户输入的名称，或使用目录名
    pkg.name = projectName || path.basename(root)

    // ============================= 根据用户选择移除不需要的依赖 =============================
    if (!needEditor) {
      // 如果不需要富文本编辑器，删除 aieditor 依赖
      delete pkg.dependencies.aieditor

      // 同时删除编辑器组件文件
      const editorPath = path.join(root, 'src/components/BaseEditor.vue')
      if (fs.existsSync(editorPath)) {
        fs.unlinkSync(editorPath)
      }
    }

    // 写入修改后的 package.json，使用 2 空格缩进，末尾添加换行符
    write('package.json', JSON.stringify(pkg, null, 2) + '\n')
  } catch (error) {
    console.error(`${red('✖')} 处理 package.json 失败`)
    throw error
  }

  // ============================= 删除不需要的文件 =============================
  if (!needUpload) {
    // 如果不需要文件上传功能，删除上传工具文件
    const uploadPath = path.join(root, 'src/utils/upload.ts')
    if (fs.existsSync(uploadPath)) {
      fs.unlinkSync(uploadPath)
    }
  }

  // ============================= 更新环境变量文件 =============================
  try {
    const envPath = path.join(root, '.env')
    // 读取 .env 文件内容
    let envContent = fs.readFileSync(envPath, 'utf-8')

    // 替换路由模式配置
    envContent = envContent.replace('VITE_PATH_MODE=hash', `VITE_PATH_MODE=${pathMode}`)
    // 替换项目名称
    envContent = envContent.replace('VITE_PROJECT_NAME=', `VITE_PROJECT_NAME=${projectTitle}`)
    // 替换应用 ID
    envContent = envContent.replace('VITE_APPID=', `VITE_APPID=${appId}`)

    // 写回文件
    fs.writeFileSync(envPath, envContent)
  } catch (error) {
    console.error(`${red('✖')} 更新环境变量文件失败`)
    throw error
  }

  console.log(`${green('✓')} 项目文件已创建`)

  // ============================= 检测包管理器 =============================
  // 从环境变量中获取用户使用的包管理器信息
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  console.log(process.env.npm_config_user_agent)
  // 如果无法检测到，默认使用 pnpm
  const pkgManager = pkgInfo ? pkgInfo.name : 'pnpm'

  // ============================= 显示成功信息和后续步骤 =============================
  console.log()
  console.log(`${green('✓')} 项目创建成功！`)
  console.log()
  console.log(`${lightGreen('━'.repeat(60))}`)
  console.log()

  // 显示后续操作步骤
  console.log(`${yellow('📦 下一步：')}`)
  console.log()

  // 步骤 1：进入项目目录
  console.log(`  ${cyan('1.')} 进入项目目录：`)
  console.log(`     ${cyan('cd')} ${targetDir}`)
  console.log()

  // 步骤 2：安装依赖
  console.log(`  ${cyan('2.')} 安装依赖：`)
  console.log(`     ${cyan(pkgManager === 'yarn' ? 'yarn' : `${pkgManager} install`)}`)
  console.log()

  // 步骤 3：启动开发服务器
  console.log(`  ${cyan('3.')} 启动开发服务器：`)
  console.log(
    `     ${cyan(pkgManager === 'yarn' ? 'yarn dev:master' : `${pkgManager} run dev:master`)}`,
  )
  console.log()
  console.log(`${lightGreen('━'.repeat(60))}`)
  console.log()

  // 显示重要提示
  console.log(`${magenta('💡 重要提示：')}`)
  console.log(`  ${yellow('•')} 请根据实际情况修改 ${cyan('.env.*')} 文件中的环境变量`)
  console.log(`  ${yellow('•')} 本项目路由依赖于权限接口，请配置后台权限`)
  console.log(`  ${yellow('•')} VSCode 如果在右下角弹出提示安装推荐扩展，请允许安装`)
  console.log(
    `  ${yellow('•')} 更多信息请查看 ${cyan('README.md')} 或联系 Email： ${cyan('ceo@yzre.cn')}`,
  )
  console.log()

  // 显示文档链接
  console.log(`${blue('📚 开发规范：')} ${cyan('https://www.yuque.com/wang_junjie/front')}`)
  console.log()
  console.log(`${green('祝您开发愉快！')} 🎉`)
  console.log()
}

// ============================= 启动程序 =============================

/**
 * 执行初始化函数并捕获可能的错误
 * 如果创建过程中出现任何错误，显示友好的错误信息并退出程序
 */
init().catch((e) => {
  console.error()
  console.error(`${red('✖')} 创建项目失败：`)
  console.error()

  // 显示错误详细信息
  if (e.message) {
    console.error(`  ${e.message}`)
  } else {
    console.error(`  ${e}`)
  }

  console.error()
  console.error(`${yellow('提示：')} 如果问题持续存在，请联系Email：`)
  console.error(`  ${cyan('ceo@yzre.cn')}`)
  console.error()

  // 以错误状态码 1 退出进程
  process.exit(1)
})
