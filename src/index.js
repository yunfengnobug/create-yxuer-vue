import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'
import minimist from 'minimist'
import { blue, cyan, green, lightGreen, lightRed, magenta, red, reset, yellow } from 'kolorist'

// 获取当前文件的目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 默认项目名称
const defaultProjectName = 'yxuer-vue-project'

// 解析命令行参数
const argv = minimist(process.argv.slice(2), {
  string: ['_'],
  boolean: ['help'],
  alias: { h: 'help' },
})

// 显示帮助信息
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

// 工具函数：格式化目标目录
function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, '')
}

// 工具函数：检查目录是否为空
function isEmpty(path) {
  if (!fs.existsSync(path)) {
    return true
  }
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

// 工具函数：清空目录
function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

// 工具函数：复制文件
function copy(src, dest) {
  try {
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
      copyDir(src, dest)
    } else {
      fs.copyFileSync(src, dest)
    }
  } catch (error) {
    console.error(`${red('✖')} 复制文件失败: ${src} -> ${dest}`)
    throw error
  }
}

// 工具函数：复制目录
function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

// 工具函数：检查包管理器
function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  }
}

// 工具函数：写入文件并替换变量
function writeFileWithReplace(filePath, content, replacements) {
  let result = content
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(key, 'g'), value)
  }
  fs.writeFileSync(filePath, result, 'utf-8')
}

// 主函数
async function init() {
  const argTargetDir = argv._[0]
  let targetDir = argTargetDir || defaultProjectName

  console.log()
  console.log(`${blue('🚀 欢迎使用 create-yxuer-vue 脚手架！')}`)
  console.log()

  let result = {}

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : 'text',
          name: 'projectName',
          message: reset('项目名称：'),
          initial: defaultProjectName,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultProjectName
          },
        },
        {
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
        {
          type: (_, { overwrite } = {}) => {
            if (overwrite === 'no') {
              throw new Error(red('✖') + ' 操作已取消')
            }
            return null
          },
          name: 'overwriteChecker',
        },
        {
          type: 'text',
          name: 'projectTitle',
          message: reset('项目标题（显示在浏览器标签）：'),
          initial: '深瞳子应用',
        },
        {
          type: 'text',
          name: 'appId',
          message: reset('应用 ID：'),
          initial: 'YXUER_DEMO',
        },
        {
          type: 'select',
          name: 'pathMode',
          message: reset('路由模式：'),
          choices: [
            { title: 'Hash 模式（推荐）', value: 'hash' },
            { title: 'History 模式', value: 'history' },
          ],
          initial: 0,
        },
        {
          type: 'select',
          name: 'needEditor',
          message: reset('是否需要富文本编辑器（AIEditor）？'),
          choices: [
            { title: '是', value: true },
            { title: '否', value: false },
          ],
          initial: 1,
        },
        {
          type: 'select',
          name: 'needUpload',
          message: reset('是否需要文件上传工具（七牛云）？'),
          choices: [
            { title: '是', value: true },
            { title: '否', value: false },
          ],
          initial: 1,
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' 操作已取消')
        },
      },
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    return
  }

  // 获取用户输入
  const { projectName, overwrite, projectTitle, appId, pathMode, needEditor, needUpload } = result

  const root = path.join(process.cwd(), targetDir)

  // 处理目录覆盖
  if (overwrite === 'yes') {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  console.log()
  console.log(`${green('✓')} 正在创建项目到 ${cyan(root)}`)

  // 获取模板路径
  const templateDir = path.resolve(__dirname, '../template')

  // 复制模板文件
  const write = (file, content) => {
    const targetPath = path.join(root, file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  // 复制基础文件
  const files = fs.readdirSync(templateDir)
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file)
  }

  // 处理 package.json
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, 'package.json'), 'utf-8'))
    pkg.name = projectName || path.basename(root)

    // 根据用户选择移除不需要的依赖
    if (!needEditor) {
      delete pkg.dependencies.aieditor
      // 删除编辑器组件文件
      const editorPath = path.join(root, 'src/components/BaseEditor.vue')
      if (fs.existsSync(editorPath)) {
        fs.unlinkSync(editorPath)
      }
    }

    write('package.json', JSON.stringify(pkg, null, 2) + '\n')
  } catch (error) {
    console.error(`${red('✖')} 处理 package.json 失败`)
    throw error
  }

  // 删除不需要的文件
  if (!needUpload) {
    const uploadPath = path.join(root, 'src/utils/upload.ts')
    if (fs.existsSync(uploadPath)) {
      fs.unlinkSync(uploadPath)
    }
  }

  // 更新 .env 文件
  try {
    const envPath = path.join(root, '.env')
    let envContent = fs.readFileSync(envPath, 'utf-8')
    envContent = envContent.replace('VITE_PATH_MODE=hash', `VITE_PATH_MODE=${pathMode}`)
    envContent = envContent.replace('VITE_PROJECT_NAME=', `VITE_PROJECT_NAME=${projectTitle}`)
    envContent = envContent.replace('VITE_APPID=', `VITE_APPID=${appId}`)
    fs.writeFileSync(envPath, envContent)
  } catch (error) {
    console.error(`${red('✖')} 更新环境变量文件失败`)
    throw error
  }

  console.log(`${green('✓')} 项目文件已创建`)

  // 获取包管理器
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'pnpm'

  console.log()
  console.log(`${green('✓')} 项目创建成功！`)
  console.log()
  console.log(`${lightGreen('━'.repeat(60))}`)
  console.log()
  console.log(`${yellow('📦 下一步：')}`)
  console.log()
  console.log(`  ${cyan('1.')} 进入项目目录：`)
  console.log(`     ${cyan('cd')} ${targetDir}`)
  console.log()
  console.log(`  ${cyan('2.')} 安装依赖：`)
  console.log(`     ${cyan(pkgManager === 'yarn' ? 'yarn' : `${pkgManager} install`)}`)
  console.log()
  console.log(`  ${cyan('3.')} 启动开发服务器：`)
  console.log(
    `     ${cyan(pkgManager === 'yarn' ? 'yarn dev:master' : `${pkgManager} run dev:master`)}`,
  )
  console.log()
  console.log(`${lightGreen('━'.repeat(60))}`)
  console.log()
  console.log(`${magenta('💡 重要提示：')}`)
  console.log(`  ${yellow('•')} 请根据实际情况修改 ${cyan('.env.*')} 文件中的环境变量`)
  console.log(`  ${yellow('•')} 本项目路由依赖于权限接口，请配置后台权限`)
  console.log(`  ${yellow('•')} VSCode 会提示安装推荐扩展，请允许安装`)
  console.log(`  ${yellow('•')} 更多信息请查看 ${cyan('README.md')}`)
  console.log()
  console.log(`${blue('📚 文档：')} ${cyan('https://下一版再更新文档')}`)
  console.log()
  console.log(`${green('祝您开发愉快！')} 🎉`)
  console.log()
}

init().catch((e) => {
  console.error()
  console.error(`${red('✖')} 创建项目失败：`)
  console.error()
  if (e.message) {
    console.error(`  ${e.message}`)
  } else {
    console.error(`  ${e}`)
  }
  console.error()
  console.error(`${yellow('提示：')} 如果问题持续存在，请联系Email：`)
  console.error(`  ${cyan('ceo@yzre.cn')}`)
  console.error()
  process.exit(1)
})
