const fs = require("fs");
const path = require("path");
const fileName = "festivalsData.js";
const strFestivalJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/source/festivalsTable.json"), "utf-8"));
var simplifiedJSON = {};
var trimEmpty = function (json) {
    var newJSON = {};
    for (let key in json){
        json[key] !== "" && (newJSON[key] = json[key])
    };
    return newJSON;
};
var trimSdLd = function (obj) {
    var newObj = {};
    for (let s_l in obj) {
        newObj[s_l] = {};
        for (let month in obj[s_l]) {
            var json = trimEmpty(obj[s_l][month]);
            Object.keys(json).length !== 0 && (newObj[s_l][month] = json);
        }
    }
    return newObj;
};
for (let i_n_no in strFestivalJSON) {
    simplifiedJSON[i_n_no] = trimSdLd(strFestivalJSON[i_n_no]);
}
fs.writeFileSync(path.resolve(__dirname, `../data/${fileName}`), `module.exports.festivals=${JSON.stringify(simplifiedJSON)}`, "utf-8");