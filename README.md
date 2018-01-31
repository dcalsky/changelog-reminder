Changelog-reminder
=================

[![Build Status](https://travis-ci.org/dcalsky/changelog-reminder.svg?branch=master)](https://travis-ci.org/dcalsky/changelog-reminder) [![npm](https://img.shields.io/npm/dw/changelog-reminder.svg)](https://www.npmjs.com/package/changelog-reminder) [![npm](https://img.shields.io/npm/v/changelog-reminder.svg)](https://www.npmjs.com/package/changelog-reminder)

[![NPM](https://nodei.co/npm/changelog-reminder.png)](https://nodei.co/npm/changelog-reminder/)


Changelog-reminder is a CHANGELOG file parsing and logging tool. It will parse the changelog file with [keep a changelog](http://keepachangelog.com/en/1.0.0/) as the standard format.

After parsing the changelog file of your project, it will show what new features have been added since the last update and records the current changelog version as the basis for the next.


## Install changelog-reminder
```bash
$ npm install changelog-reminder
```

Or install it to global:

```bash
$ npm install changelog-reminder -g
```

*npm is a builtin CLI when you install Node.js - [Installing Node.js with NVM](https://keymetrics.io/2015/02/03/installing-node-js-and-io-js-with-nvm/)*

## Start parsing and logging
**Make sure you have a changelog file in your project.** You can find the sample and standard format changelog file in [keep a changelog](http://keepachangelog.com/en/1.0.0/).

### Installed in global
```bash
$ changelog-reminder
```
It will outputs all changes after parsing:[![asciicast](https://asciinema.org/a/7bhdpHKIIa7psr8dmbjiGrovf.png)](https://asciinema.org/a/7bhdpHKIIa7psr8dmbjiGrovf)


### Installed as a dependency in project 
Add this starting instruction to NPM scripts, such as this `package.json`:

```json
{
  "name": "example",
  "version": "0.0.1",
  "scripts": {
    "start": "changelog-reminder && node main.js"
  }
}
```

Then run `$ npm run start`, the changelog-reminder will  launch.


### No changes found
If no changes found, changelog-reminder will show the status:
![](./snapshots/nochanges.png?raw=true)


## Usage
Usage: `changelog-reminder [options]`. Check all options by typing `$ changelog-reminder -h`


### Config file
Changelog-reminder will load `changelog-reminder.yaml` as config file by default. Also you can use `changelog-reminder -c <file relative path>` to specify a config file. 

If no config file is existed in your project, the config data will use default arguments.

```javascript
// changelog-reminder.js
const path = require("path");

module.exports = {
  confirm: true,
  showIntro: true,
  changelog: "./test/CHANGELOG",
  logger: path.join(process.cwd(), "./test/.changelogger")
};
```

- `changelog`: Specify the changelog file. Default: `$ ./CHANGELOG`
- `logger`: Specify the logger file, it records which verison  you are staying at. Default: `.changelogger`
- `showIntro` option: changelog-reminder will display the CHANGELOG introduction each time. Default: `true`
- `confirm` option: after displaying the changes, changelog-reminder will enquire your whether already know the changes. It makes sure developers exactly know what's new. Default: `false` ![](./snapshots/inquiry.png?raw=true)


