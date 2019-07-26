const fs = require("fs");
const path = require("path");
var str = fs.readFileSync(path.resolve(__dirname, "../data/source/codepoints"), "utf-8");
var or = str.split("\n");
var param = "codepoints";
var obj = {};
for(var x=0, l=or.length; x<l; x++){
    var a = or[x].match(/(.*)\ (.*)/);
    a && (obj[a[1]] = a[2]);
}
fs.writeFileSync(path.join(__dirname, "../data/codepoints.js"), `window.${param}=${JSON.stringify(obj)}`, "utf-8");