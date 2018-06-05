const { cd, exec, echo, touch } = require('shelljs');
const { readFileSync } = require('fs');
const url = require('url');
const colors = require('colors');

let ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

echo(colors.yellow('Deploying example!'));
cd('example/dist');
touch('.nojekyll');
exec('git init');
exec('git add .');
exec('git config user.name "hasparus"');
exec('git config user.email "hasparus@gmail.com"');
exec('git commit -m "docs(docs): update example on gh-pages"');
exec(
  `git push --force --quiet https://"${ghToken}"@github.com/hasparus/springy-svgy-buttons master:gh-pages`
);
echo(colors.yellow('Example deployed!'));
