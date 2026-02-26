.husky文件夹不要复制粘贴，是执行 pnpm exec husky init 进行格式化自动生成的，生成后修改pre-commit文件内容即可正常工作。

如果你之前使用过 husky，更改过 git 的 hooks 路径导致错误，可以执行 git config core.hooksPath 进行检查。
一般情况下，Git 的 hooks 路径配置指向了 .husky/_
在项目目录下执行 git config core.hooksPath
出现 .husky/_ 是正确的，否则执行 git config core.hooksPath .husky/_ 将其改为 .husky/_
再次执行 git config core.hooksPath 检查是否正确
