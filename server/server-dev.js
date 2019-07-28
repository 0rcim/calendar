const http = require("http");
const fs = require("fs");
const path = require("path");
const urlLib = require("url");
const jsonFile = "datesData.json"; // 所有的便笺数据存储在 ./db/datesData.json 之中
var port = "4321";
var filepath = path.resolve(__dirname, `./db/${jsonFile}`)
var fileExist = true;
try{
    // jsonFile 文件是否存在在 ./db 下？
    fs.accessSync(filepath);
}catch(err){
    fileExist = false;
};
const db = fileExist && JSON.parse(fs.readFileSync(filepath, "utf-8"));
http.createServer(function(req, res){
    res.writeHead(200, {"content-type": "text/html;charset=utf-8", "Access-Control-Allow-Origin": "*"});
    if(req.url != "/favicon.ico"){

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
                console.log(db);
                res.end();
            }
            if(req_path === "/getNotes"){
                var queryYear = reqData.sy;
                var queryMonth = parseInt(reqData.sm);
                var dayNotes = {};
                dayNotes = db["db"][queryYear] && db["db"][queryYear][queryMonth];
                console.log(queryYear, parseInt(queryMonth));
                var str_daynotes = JSON.stringify(dayNotes);
                res.write(str_daynotes);
                res.end();
            }
        });

    }
}).listen(port);