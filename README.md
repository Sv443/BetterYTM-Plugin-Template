<div style="text-align: center;" align="center">

<img src="./assets/plugin_icon_128x128.png" width="80" height="80" alt="default icon of this template">  

## BetterYTM Plugin Template
[**Introduction**](#introduction) • [**Prerequisites**](#prerequisites) • [**Setup**](#setup) • [**Commands**](#commands) • [**License**](#license)

</div>
<br>

## Introduction:
This template is perfect for anyone who wants to create a plugin for BetterYTM but doesn't want to deal with the hassle of setting up a development environment.
It contains an example plugin that makes use of [BetterYTM's](https://github.com/Sv443/BetterYTM) existing API to further alter the behavior of YouTube and YouTube Music.  
  
The plugin will be built with [Vite](https://vitejs.dev/) and [pnpm](https://pnpm.io/) and written in [TypeScript](https://www.typescriptlang.org/) to provide a modern and lightning fast development experience.  
You may also import plain JavaScript files (with the extension .mjs) if you prefer that instead.  
  
It is also set up to be easily hosted on a local server for testing and to be built for production with a single command.  
If you use a UserScript manager extension such as [Violentmonkey](https://violentmonkey.github.io/), you can easily test the plugin by opening the local server URL in your browser.  
The extension will keep updating the userscript automatically when any changes are made.  
Configure this behavior in the `nodemonConfig` object in `package.json`.  
  
The library [UserUtils](https://github.com/Sv443-Network/UserUtils) is also included to provide a plethora of useful functions and classes for UserScripts.  
I highly recommend checking it out! It is included on BetterYTM's API via `unsafeWindow.BYTM.UserUtils`.

<br>

## Prerequisites
- Read the [BetterYTM Contributing Guide here](https://github.com/Sv443/BetterYTM/blob/main/contributing.md) (or the latest in-dev version [here](https://github.com/Sv443/BetterYTM/blob/develop/contributing.md)).  
  It contains all the information you need to know about the BetterYTM API and how to create a plugin.
- Basic knowledge of writing UserScripts with TypeScript.
- A powerful IDE like [VS Code](https://code.visualstudio.com/) to be able to inspect TS types and get auto-completion for the BYTM API.

<br>

## Setup
1. [Create a repository based on this template.](https://github.com/Sv443/BetterYTM-Plugin-Template/generate)
2. Clone the repository to your local machine.
3. Use `git submodule update --init --recursive` to clone the BetterYTM submodule.
4. Install BetterYTM from the [releases page.](https://github.com/Sv443/BetterYTM/releases)  
  If you wanna prepare your code for the latest version that's still in development, check out the latest [pull request](https://github.com/Sv443/BetterYTM/pulls) for the download and changelog.
5. Make sure Node.js and [pnpm](https://pnpm.io/) are installed.
6. Open a terminal in the project root and run `pnpm i` to install dependencies.
7. Run `pnpm run dev` to build the plugin and host it on a local server for testing.  
  Open this URL with your UserScript manager extension to easily test the plugin.  
  I recommend using [Violentmonkey](https://violentmonkey.github.io/), which will automatically update the userscript when any changes are made.

<br>

## Commands
- `pnpm run dev` - Builds the plugin and hosts it on a local server for testing.  
  The default URL is `http://localhost:8767/BetterYTM%20Plugin%20Template.user.js` (change the port in `.env` and file name in `package.json`).  
  This will also watch for changes and automatically rebuild the plugin.
- `pnpm run build` - Builds the plugin for production into the `dist` folder.  
  This should be committed for easy inspection and universal installation. This then also allows you to easily permalink to every version's code for users to install.
- `pnpm run lint` - Lints the code with ESLint.  
  Feel free to modify the config at `.eslint.config.mjs` to your liking.
- `pnpm run format` - Formats all auto-fixable problems in the code with ESLint, according to the config.

<br>

## License
This project (minus Git submodules) is licensed under the [WTFPL](./LICENSE.txt) - do whatever you want with it.  
It is based on [BetterYTM](https://github.com/Sv443/BetterYTM), which itself is licensed under the [GPL-3.0 license.](https://github.com/Sv443/BetterYTM/blob/main/LICENSE.txt)  
  
<sup>Make sure to include this in your plugin's readme to comply with [BetterYTM's plugin sublicense.](https://github.com/Sv443/BetterYTM/blob/main/license-for-plugins.txt)</sup>
