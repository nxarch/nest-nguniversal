const scopes = ['general', 'ci', 'nest-nguniversal'];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': async (ctx) => [2, 'always', scopes],
    'type-enum': [2, 'always', ['chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'release', 'style', 'test']],
  },
};
