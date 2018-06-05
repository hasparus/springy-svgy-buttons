const { cd, exec, echo, touch } = require('shelljs');
const { readFileSync } = require('fs');
const url = require('url');
const colors = require('colors');

let repoUrl;
let pkg = JSON.parse(readFileSync('package.json') as any);
if (typeof pkg.repository === 'object') {
  if (!pkg.repository.hasOwnProperty('url')) {
    throw new Error('URL does not exist in repository section');
  }
  repoUrl = pkg.repository.url;
} else {
  repoUrl = pkg.repository;
}

let parsedUrl = url.parse(repoUrl);
let repository = (parsedUrl.host || '') + (parsedUrl.path || '');
let ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

echo(colors.yellow('Deploying example!'));
cd('example/dist');
touch('.nojekyll');
exec('git init');
exec('git add .');
exec('git config user.name "hasparus"');
exec('git config user.email "hasparus@gmail.com"');
exec('git commit -m "docs(docs): update example on gh-pages"');
exec(`git push --force --quiet "${repository}" master:gh-pages`);
echo(colors.yellow('Example deployed!'));
