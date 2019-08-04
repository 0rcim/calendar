const http = require("http");
const fs = require("fs");
const path = require("path");
const urlLib = require("url");
const jsonFile = "datesData.json"; // 所有的便笺数据存储在 ./db/datesData.json 之中
const { exec } = require("child_process");
const utils = require("../src/utils");
utils.dateFormat();
const project_root_dir = path.resolve(__dirname, "../");
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
var port = "4321";
var filepath = path.resolve(__dirname, `./db/${jsonFile}`)
var fileExist = true;
try{
    // jsonFile 文件是否存在在 ./db 下？
    fs.accessSync(filepath);
}catch(err){
    fileExist = false;

};
// 如果datesData不存在就新建一个
if(!fileExist){
    let now = new Date();
    let originDay = {}, y = parseInt(now.format("yyyy")), m = parseInt(now.format("MM")), d = parseInt(now.format("dd"))
    originDay[y] = {};
    originDay[y][m] = {};
    let firstNotes = {
        "id": `[${now.format("yyyy-MM-dd")}]#1`,
        "title": "创建你的第一条今日便笺",
        "content": "回到「日历」页面，点击顶部右上角「添加按钮」，开始创建你的第一条便笺！\n更多信息请点击菜单中的「帮助」。",
        "update_time": now.format("hh:mm")
    };
    originDay[y][m][d] = [firstNotes];
    fs.writeFileSync(filepath, 
       JSON.stringify({
           "db_path": "~/server/db/datesData.json",
           "created": now.format("yyyy/MM/dd-hh:mm:ss"),
           "db": originDay,
           "settings": []
       }), 
       "utf-8"
   );
}
// const db = fileExist && JSON.parse(fs.readFileSync(filepath, "utf-8"));
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
            }
            if(req_path === "/getNotes"){
                var queryYear = reqData.sy;
                var queryMonth = parseInt(reqData.sm);
                var dayNotes = {};
                db["db"][queryYear] && db["db"][queryYear][queryMonth] && (dayNotes=db["db"][queryYear][queryMonth]);
                var str_daynotes = JSON.stringify(dayNotes);
                res.write(str_daynotes);
            }
            if(req_path === "/deleteNotes"){
                let tarNotes = JSON.parse(reqData.notes);
                var ref = {};
                for(var x=0, l=tarNotes.length; x<l; x++){
                    let mth = tarNotes[x].match(/\[(.*)-(.*)-(.*)\]#(.*)/);
                    let sy = parseInt(mth[1]), sm = parseInt(mth[2]), sd = parseInt(mth[3]);
                    ref[sy] || (ref[sy] = {});
                    ref[sy][sm] || (ref[sy][sm] = {});
                    ref[sy][sm][sd] || (ref[sy][sm][sd] = []);
                    ref[sy][sm][sd].push(tarNotes[x])
                };
                // ---- //
                for(let year in ref)
                for(let month in ref[year])
                for(let day in ref[year][month])
                for(let x = 0, l=ref[year][month][day].length; x<l; x++)
                for(let y = 0, m=db["db"][year][month][day].length; y<m; y++)
                if(db["db"][year][month][day][y]){
                    db["db"][year][month][day][y].id === ref[year][month][day][x] && db["db"][year][month][day].splice(y, 1);
                }
                // ---- //
                // 重新写入 # 编号顺序
                for(let year in db["db"])
                for(let month in db["db"][year])
                for(let day in db["db"][year][month])
                for(let x = 0, l=db["db"][year][month][day].length; x<l; x++)(
                    db["db"][year][month][day][x].id = 
                    db["db"][year][month][day][x].id.split("#").slice(0, 1).concat(x+1).join("#")
                )
                // ---- //
                fs.writeFileSync(filepath, JSON.stringify(db), "utf-8");
            }
            if(req_path === "/getDBInfo"){
                let allNotesData = db["db"];
                let DBInfo = {};
                for(var year in allNotesData){
                    DBInfo[year] = {};
                    for(var month in allNotesData[year]){
                        var count = 0;
                        for(var day in allNotesData[year][month]){
                            let len = allNotesData[year][month][day].length;
                            count += len;
                        }
                        count && (DBInfo[year][month] = {}) && (DBInfo[year][month]["notesNum"] = count);
                    }
                };
                res.write(JSON.stringify(DBInfo));
            }
            if(req_path === "/sendSettings"){
                reqData.setting = JSON.parse(reqData.setting);
                let setting_name = reqData.setting.name;
                var posi = -1;
                for(var x=0, l=db["settings"].length; x<l; x++){
                    if(setting_name === db["settings"][x].name){
                        posi = x;
                    }
                };
                posi !== -1 ? db["settings"].splice(posi, 1, reqData.setting) : db["settings"].push(reqData.setting);
                fs.writeFileSync(filepath, JSON.stringify(db), "utf-8");
            }
            if(req_path === "/getSettings"){
                let name = reqData.name;
                var obj = {};
                if(name === "*"){
                    obj = db["settings"];
                }else{
                    for(var x=0, l=db["settings"].length; x<l; x++){
                        if(db["settings"][x].name === name){
                            obj = db["settings"][x];
                            break;
                        }
                    }
                }
                res.write(JSON.stringify(obj));
            }
            res.end();
        });

    }
}).listen(port);
console.info("server is listening on \x1B[35m%s\x1B[39m\npress \x1B[32m%s\x1B[39m to stop!", `http://localhost:${port}`, "Ctrl + C");