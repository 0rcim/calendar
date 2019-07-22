const path = require("path");
const webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const argvs = require("process").argv;
module.exports = {
    "entry": ["babel-polyfill", "./src/main.js"],
    "output": {
        "path": path.resolve(__dirname, "./dist"),
        "publicPath": argvs[argvs.indexOf("--mode")+1] === "development" ? "/dist/" : "./dist/",
        "filename": "build.js"
    },
    // "devtool": "#eval-source-map",
    "devServer": {
        "historyApiFallback": true,
        "overlay": true,
        "clientLogLevel": "none"
    },
    "resolve": {
        "alias": {
            "vue$": "vue/dist/vue.esm.js"
        }
    },
    "module": {
        "rules": [
            {
                "test": /\.css$/,
                "use": [
                    "vue-style-loader",
                    "css-loader"
                ]
            },
            {
                "test": /\.scss/,
                "use": [
                    "vue-style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                "test": /\.js/,
                "loader": "babel-loader",
                "exclude": /node_modules/
            },
            {
                "test": /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                "loader": 'file-loader',
                "options": {
                    "name": '[name].[ext]?[hash]'
                }
            },
            {
                "test": /\.vue$/,
                "loader": 'vue-loader',
                "options": {
                    "loaders": {
                        'scss': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader'
                        ],
                        'sass': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ]
                    }
                }
            }
        ]
    },
    "plugins": [
        new VueLoaderPlugin()
    ]
};