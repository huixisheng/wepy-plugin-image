// eslint-disable
module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'body-leading-blank': [1, 'always'], // body开始于空白行
    'footer-leading-blank': [1, 'always'], // footer开始于空白行
    'header-max-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'camel-case'], // scope驼峰
    'subject-empty': [2, 'never'], // subjec不为空
    'subject-full-stop': [2, 'never', '.'], // subject结尾不加'.'
    'subject-tense': [1, 'always', ['present-imperative']], //以动词开头，使用第一人称现在时，比如change，而不是changed或changes
    'type-case': [2, 'always', 'lowerCase'], // type小写
    'type-empty': [2, 'never'], // type不为空
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci', // 更改我们的持续集成文件和脚本（示例范围：Travis，Circle，BrowserStack，SauceLabs）
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ]
  }
};
/**
 * ref
 * - https://mrzhang123.github.io/2017/10/18/git-commint-norm/
 * - https://www.phodal.com/blog/how-to-write-a-better-git-commit-message/
 * - http://marionebl.github.io/commitlint/#/reference-rules
 */
/**
Must be one of the following:

feat: A new feature
fix: A bug fix
docs: Documentation only changes
style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
refactor: A code change that neither fixes a bug nor adds a feature
perf: A code change that improves performance
test: Adding missing or correcting existing tests
chore: Changes to the build process or auxiliary tools and libraries such as documentation generation
 */