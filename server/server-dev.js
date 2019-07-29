const http = require("http");
const fs = require("fs");
const path = require("path");
const urlLib = require("url");
const jsonFile = "datesData.json"; // 所有的便笺数据存储在 ./db/datesData.json 之中
const utils = require("../src/utils");
utils.dateFormat();
var port = "4321";
var filepath = path.resolve(__dirname, `./db/${jsonFile}`)
var fileExist = true;
try{
    // jsonFile 文件是否存在在 ./db 下？
    fs.accessSync(filepath);
}catch(err){
    fileExist = false;
};
// const db = fileExist && JSON.parse(fs.readFileSync(filepath, "utf-8"));
// 如果datesData不存在就新建一个
fileExist || fs.writeFileSync(filepath, 
    JSON.stringify({
        "db_path": "~/server/db/datesData.json",
        "created": new Date().format("yyyy/MM/dd-hh:mm:ss"),
        "db": {}
    }), 
    "utf-8"
);
http.createServer(function(req, res){
    res.writeHead(200, {"content-type": "text/html;charset=utf-8", "Access-Control-Allow-Origin": "*"});
    if(req.url != "/favicon.ico"){
        let db = JSON.parse(fs.readFileSync(filepath, "utf-8"));
        var resultData = "";
        req.on("data", function(data){
            resultData += data;
        });
        req.on("end", function(){
            var retDataSplit = resultData.split("&");
            var reqData = {};
            for(var x=0, l=retDataSplit.length; x<l; x++){
                var item = retDataSplit[x].split("=");
                var key = item[0], value = item[1];
                reqData[key] = value;
            };
            res.writeHead(200, {"content-type": "text/html;charset=utf-8", "Access-Control-Allow-Origin": "*"});
            var req_url = urlLib.parse(req.url, true)
            var req_path = req_url.path;
            if(req_path === "/sendNotes"){
                console.log(reqData);
                let id = reqData.id;
                let mth = id.match(/\[(.*)\]#(.*)/);
                let tar_date = new Date(mth[1]);
                let n_order = parseInt(mth[2])-1;
                var tar_y = parseInt(tar_date.format("yyyy")),
                    tar_m = parseInt(tar_date.format("MM")),
                    tar_d = parseInt(tar_date.format("dd"));
                var dataBase = db;
                dataBase["db"][tar_y] || (dataBase["db"][tar_y] = {});
                dataBase["db"][tar_y][tar_m] || (dataBase["db"][tar_y][tar_m] = {});
                dataBase["db"][tar_y][tar_m][tar_d] || (dataBase["db"][tar_y][tar_m][tar_d] = []);
                dataBase["db"][tar_y][tar_m][tar_d][n_order] = reqData;
                fs.writeFileSync(filepath, JSON.stringify(dataBase), "utf-8");
                console.log(mth[1], mth[2])
                // console.log(db);
                res.end();
            }
            if(req_path === "/getNotes"){
                var queryYear = reqData.sy;
                var queryMonth = parseInt(reqData.sm);
                var dayNotes = {};
                db["db"][queryYear] && db["db"][queryYear][queryMonth] && (dayNotes=db["db"][queryYear][queryMonth]);
                // dayNotes = db["db"][queryYear] ? (
                //     db["db"][queryYear][queryMonth]
                // ) : [];
                // console.log(queryYear, parseInt(queryMonth), dayNotes);
                var str_daynotes = JSON.stringify(dayNotes);
                res.write(str_daynotes);
                res.end();
            }
            if(req_path === "/deleteNotes"){
                console.log(reqData);
                var tar_date = new Date(reqData.date);
                var tar_y = parseInt(tar_date.format("yyyy")),
                    tar_m = parseInt(tar_date.format("MM")),
                    tar_d = parseInt(tar_date.format("dd"));
                var n_order = parseInt(reqData.n_order);
                var dataBase = db; 
                dataBase["db"][tar_y][tar_m][tar_d].splice(n_order, 1);
                for(var x = 0, l=dataBase["db"][tar_y][tar_m][tar_d].length; x<l; x++){
                    var tmp_id = dataBase["db"][tar_y][tar_m][tar_d][x]["id"];
                    dataBase["db"][tar_y][tar_m][tar_d][x]["id"] = tmp_id.replace(/(.*)#(.*)/, `$1#${x+1}`);
                };
                fs.writeFileSync(filepath, JSON.stringify(dataBase), "utf-8");
                res.end();
            }
        });

    }
}).listen(port);