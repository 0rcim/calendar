# 日历便笺  
<style>body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', "Microsoft Yahei", sans-serif;}</style>
【webpack + VueJS 练习】
一个本地应用程序，可以查看公历和农历以及记录当日便笺。  
### 截图  
![screen capture](https://www.cnblogs.com/images/cnblogs_com/Orcim/1508992/o_vue-calendar-project.png)
### 加载运行
``` shell
# run this project
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
  "version": "1.0.0",
  "description": "Webpack + VueJS 练习",
  "main": "index.js",
  "scripts": {
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