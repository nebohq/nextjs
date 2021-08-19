#!/usr/bin/env node

const {
  CLI, Settings, commands: { Compiler, Watcher, Initializer },
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('@nebohq/plugin');
const fs = require('fs');
const path = require('path');

const defaultSettings = Settings.update({
  pageTemplatePath: './NeboPage.jsx',
  catchAllPagePath: './pages/[...slug].js',
  globalStylesPath: './styles/globals.css',
});

CLI([
  Initializer.configure({
    options: { defaultSettings },
    callback: async (options, processor) => {
      const { accessToken } = options;
      if (!accessToken) throw new Error('Please provide an access token.');

      const result = await processor(options);

      if (!fs.existsSync(defaultSettings.pageTemplatePath)) {
        const template = fs.readFileSync(path.join(__dirname, '../static/NeboPage.jsx'));
        fs.writeFileSync(defaultSettings.pageTemplatePath, template);
      }

      if (!fs.existsSync(defaultSettings.catchAllPagePath)) {
        const template = fs.readFileSync(path.join(__dirname, '../static/[...slug].js'));
        fs.writeFileSync(defaultSettings.catchAllPagePath, template);
      }

      // eslint-disable-next-line no-console
      console.log('');
      // eslint-disable-next-line no-console
      console.log(`
        Added two files for Next.js:
        - ${defaultSettings.pageTemplatePath} contains the component to render Nebo pages, as well as some helper functions. 
        - ${defaultSettings.catchAllPagePath} sets up the catch all renderer for Nebo pages.
      `.trim());

      return result;
    },
  }),
  Compiler.configure({ options: { defaultSettings } }),
  Watcher.configure({ options: { defaultSettings } }),
]);
