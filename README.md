# 日历便笺  
【webpack + VueJS 练习】
一个本地应用程序，包含普通日历功能：查看公历农历、节气节日；以及当日便笺记录等功能。  
### 截图  
![screen capture](https://www.cnblogs.com/images/cnblogs_com/Orcim/1508992/o_vue-calendar-project.png)
### 加载运行
``` shell
# run this app
npm run app
```
``` shell
# dev this project
npm run dev
```
### webpack 打包
``` shell
# build
npm run build
```
### about
**package.json**
```json
{
  "name": "calendar",
  "version": "2.0.0",
  "description": "Webpack + VueJS 练习",
  "main": "index.js",
  "scripts": {
    "app": "node server\/server.js",
    "dev": "webpack-dev-server --open --hot --mode development",
    "build": "webpack --progress --hide-modules --mode production"
  },
  "author": "Orcim",
  "license": "ISC",
  "keywords": [],
  "dependencies": {
    "open": "^6.4.0",
    "vue": "^2.6.10"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-polyfill": "^6.26.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-3": "^6.24.1",
    "css-loader": "^3.1.0",
    "file-loader": "^4.1.0",
    "node-sass": "^4.12.0",
    "sass-loader": "^7.1.0",
    "vue-loader": "^15.7.1",
    "vue-style-loader": "^4.1.2",
    "vue-template-compiler": "^2.6.10",
    "webpack": "^4.36.1",
    "webpack-cli": "^3.3.6",
    "webpack-dev-server": "^3.7.2"
  }
}
```
### Others
![project-type](https://img.shields.io/badge/VueJS-2.6.10-41b883.svg) &nbsp; ![project-type](https://img.shields.io/badge/NodeJS-10.15.3-81b448.svg) &nbsp; ![project-type](https://img.shields.io/badge/Webpack-4.36.1-8ed6fb.svg)