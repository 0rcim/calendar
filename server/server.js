const http = require("http");
const fs = require("fs");
const path = require("path");
const urlLib = require("url");
const { exec } = require("child_process");
// console.log(dev)
const project_root_dir = path.resolve(__dirname, "../");
var port = "4321";
var url = path.resolve(project_root_dir, "./index.html");
switch (process.platform) {
    case "darwin":
        exec(`open ${url}`);
        break;
    case "win32":
        exec(`start ${url}`);
        break;
    default: 
        exec(`xdg-open`, [url]);
};
http.createServer(function(req, res){
    res.writeHead(200, {"content-type": "text/html;charset=utf-8", "Access-Control-Allow-Origin": "*"});
    if(req.url != "/favicon.ico"){

        var resultData = "";
        req.on("data", function(data){
            resultData += data;
        });
        req.on("end", function(){
            console.log(resultData.split("&"))
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
                
                res.end();
            }
        });

    }
}).listen(port);
console.info("server is listening on \x1B[35m%s\x1B[39m\npress \x1B[32m%s\x1B[39m to stop!", `http://localhost:${port}`, "Ctrl + C")