#!/usr/bin/env node
const fs = require('fs');
const chalk = require('chalk');
const degit = require('degit');
const prompts = require('prompts');

const { emptyString } = require('./validators');
prompts.override(require('yargs').argv);

console.log(chalk.blue(`Welcome to Notch!`));
console.log(chalk.blueBright(`I am Notch CLI and I can help you get started with Notch`));
console.log(chalk.blueBright(`For more info, you can also visit - https://notch-docs.vercel.app/`));

(async () => {
  const response = await prompts([
    {
      type: 'text',
      name: 'directory',
      message: `What directory do you want to install notch in?`,
      validate: emptyString('Enter a non-empty directory name'),
    },
    {
      type: 'text',
      name: 'siteName',
      message: 'Enter your site/blog name',
      validate: emptyString('Enter a non-empty site/blog name'),
    },
    {
      type: 'text',
      name: 'notionDatabaseId',
      message: 'Enter the notion database ID',
      validate: emptyString('Enter a non-empty database id'),
    },
  ]);

  const emitter = degit('maddhruv/notch', {
    force: true,
    verbose: true,
  });

  await emitter.clone(response.directory);

  console.log(chalk.green(`Created the directory ${response.directory} with Notch`));

  const siteConfigPath = `${process.cwd()}/${response.directory}/site.config.js`;

  const siteConfig = require(siteConfigPath);

  const newSiteConfig = Object.assign({}, siteConfig, {
    name: response.siteName,
    notion: {
      databaseId: response.notionDatabaseId,
    },
  });

  await fs.writeFileSync(siteConfigPath, `module.exports = ${JSON.stringify(newSiteConfig)}`);
  console.log(chalk.green('Configured Site'));
})();
