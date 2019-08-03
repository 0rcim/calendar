module.exports.getComputedStyle = getComputedStyle;
function getComputedStyle () {
  /* 兼容 IE, getComputedStyle */
  if (!window.getComputedStyle) {
    window.getComputedStyle = function(el, pseudo) {
        this.el = el;
        this.getPropertyValue = function(prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') prop = 'styleFloat';
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        }
        return this;
    }
  }
};
module.exports.getBroswerType = getBroswerType;
function getBroswerType () {
  var userAgent = navigator.userAgent; 
  console.log(userAgent)
  /**
   *  Chrome
      Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36
      FF
      Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0
      Edge
      Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763
      Opera
      Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36 OPR/62.0.3331.72
      IE11
      Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko
   */
  return {
    "Opera": userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1,
    "FF": userAgent.indexOf("Firefox") > -1,
    "Chrome": userAgent.indexOf("Chrome") > -1,
    "Safari": userAgent.indexOf("Safari") > -1,
    "IE": (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !(userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1)) || userAgent.indexOf(".NET") > -1,
    "Edge": userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1
  }
};
module.exports.dateFormat = dateFormat;
function dateFormat () {
    Date.prototype.format = function(fmt) { 
        var o = { 
           "M+" : this.getMonth()+1,                 //月份 
           "d+" : this.getDate(),                    //日 
           "h+" : this.getHours(),                   //小时 
           "m+" : this.getMinutes(),                 //分 
           "s+" : this.getSeconds(),                 //秒 
           "q+" : Math.floor((this.getMonth()+3)/3), //季度 
           "S"  : this.getMilliseconds()             //毫秒 
       }; 
       if(/(y+)/.test(fmt)) {
               fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
       }
        for(var k in o) {
           if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
       return fmt; 
   }
};
// 此处引用 https://github.com/xm2by/fragment/blob/master/公历转农历/sloarToLunar.js
module.exports.sloarToLunar = sloarToLunar;
/* 公历转农历代码思路：
1、建立农历年份查询表
2、计算输入公历日期与公历基准的相差天数
3、从农历基准开始遍历农历查询表，计算自农历基准之后每一年的天数，并用相差天数依次相减，确定农历年份
4、利用剩余相差天数以及农历每个月的天数确定农历月份
5、利用剩余相差天数确定农历哪一天 */
// 农历1949-2100年查询表
let lunarYearArr = [
    0x0b557, //1949
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
    0x0d520 //2100
  ],
  lunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
  lunarDay = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'],
  tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 公历转农历函数
function sloarToLunar(sy, sm, sd) {
  // 输入的月份减1处理
  sm -= 1;
  // 计算与公历基准的相差天数
  // Date.UTC()返回的是距离公历1970年1月1日的毫秒数,传入的月份需要减1
  let daySpan = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;
  let ly, lm, ld;
  // 确定输出的农历年份
  for (let j = 0; j < lunarYearArr.length; j++) {
    daySpan -= lunarYearDays(lunarYearArr[j]);
    if (daySpan <= 0) {
      ly = 1949 + j;
      // 获取农历年份确定后的剩余天数
      daySpan += lunarYearDays(lunarYearArr[j]);
      break
    }
  }
  // 确定输出的农历月份
  for (let k = 0; k < lunarYearMonths(lunarYearArr[ly - 1949]).length; k++) {
    daySpan -= lunarYearMonths(lunarYearArr[ly - 1949])[k];
    if (daySpan <= 0) {
      // 有闰月时，月份的数组长度会变成13，因此，当闰月月份小于等于k时，lm不需要加1
      if (hasLeapMonth(lunarYearArr[ly - 1949]) && hasLeapMonth(lunarYearArr[ly - 1949]) <= k) {
        if (hasLeapMonth(lunarYearArr[ly - 1949]) < k) {
          lm = k;
        } else if (hasLeapMonth(lunarYearArr[ly - 1949]) === k) {
          lm = '闰' + k;
        } else {
          lm = k + 1;
        }
      } else {
        lm = k + 1;
      }
      // 获取农历月份确定后的剩余天数
      daySpan += lunarYearMonths(lunarYearArr[ly - 1949])[k];
      break
    }
  }
  // 确定输出农历哪一天
  ld = daySpan;
  // 将计算出来的农历月份转换成汉字月份，闰月需要在前面加上闰字
  if (hasLeapMonth(lunarYearArr[ly - 1949]) && (typeof (lm) === 'string' && lm.indexOf('闰') > -1)) {
    lm = `闰${lunarMonth[/\d/.exec(lm) - 1]}`
  } else {
    lm = lunarMonth[lm - 1];
  }
  // 将计算出来的农历年份转换为天干地支年
  ly = getTianGan(ly) + getDiZhi(ly);

  // 将计算出来的农历天数转换成汉字
  if (ld < 11) {
    ld = `${lunarDay[10]}${lunarDay[ld-1]}`
  } else if (ld > 10 && ld < 20) {
    ld = `${lunarDay[9]}${lunarDay[ld-11]}`
  } else if (ld === 20) {
    ld = `${lunarDay[1]}${lunarDay[9]}`
  } else if (ld > 20 && ld < 30) {
    ld = `${lunarDay[11]}${lunarDay[ld-21]}`
  } else if (ld === 30) {
    ld = `${lunarDay[2]}${lunarDay[9]}`
  }
  return {
    lunarYear: ly,
    lunarMonth: lm,
    lunarDay: ld,
  }
}
// 计算农历年是否有闰月，参数为存储农历年的16进制
// 农历年份信息用16进制存储，其中16进制的最后1位可以用于判断是否有闰月
function hasLeapMonth(ly) {
  // 获取16进制的最后1位，需要用到&与运算符
  if (ly & 0xf) {
    return ly & 0xf
  } else {
    return false
  }
}
// 如果有闰月，计算农历闰月天数，参数为存储农历年的16进制
// 农历年份信息用16进制存储，其中16进制的第1位（0x除外）可以用于表示闰月是大月还是小月
function leapMonthDays(ly) {
  if (hasLeapMonth(ly)) {
    // 获取16进制的第1位（0x除外）
    return (ly & 0xf0000) ? 30 : 29
  } else {
    return 0
  }
}
// 计算农历一年的总天数，参数为存储农历年的16进制
// 农历年份信息用16进制存储，其中16进制的第2-4位（0x除外）可以用于表示正常月是大月还是小月
function lunarYearDays(ly) {
  let totalDays = 0;
  // 获取正常月的天数，并累加
  // 获取16进制的第2-4位，需要用到>>移位运算符
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    let monthDays = (ly & i) ? 30 : 29;
    totalDays += monthDays;
  }
  // 如果有闰月，需要把闰月的天数加上
  if (hasLeapMonth(ly)) {
    totalDays += leapMonthDays(ly);
  }
  return totalDays
}

// 获取农历每个月的天数
// 参数需传入16进制数值
function lunarYearMonths(ly) {
  let monthArr = [];
  // 获取正常月的天数，并添加到monthArr数组中
  // 获取16进制的第2-4位，需要用到>>移位运算符
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    monthArr.push((ly & i) ? 30 : 29);
  }
  // 如果有闰月，需要把闰月的天数加上
  if (hasLeapMonth(ly)) {
    monthArr.splice(hasLeapMonth(ly), 0, leapMonthDays(ly));
  }
  return monthArr
}
// 将农历年转换为天干，参数为农历年
function getTianGan(ly) {
  let tianGanKey = (ly - 3) % 10;
  if (tianGanKey === 0) tianGanKey = 10;
  return tianGan[tianGanKey - 1]
}
// 将农历年转换为地支，参数为农历年
function getDiZhi(ly) {
  let diZhiKey = (ly - 3) % 12;
  if (diZhiKey === 0) diZhiKey = 12;
  return diZhi[diZhiKey - 1]
}
module.exports.getSolarTerm = getSolarTerm;
function getSolarTerm (yyyy, mm, dd) {
  mm = mm-1;
  var sTermInfo = [
      0, 21208, 42467, 63836, 
      85337, 107014, 128867, 150921, 
      173149, 195551, 218072, 240693, 
      263343, 285989, 308563, 331033, 
      353350, 375494, 397447, 419210, 
      440795, 462224, 483532, 504758
  ];
  var solarTerm = [
      "小寒", "大寒", "立春", "雨水", 
      "惊蛰", "春分", "清明", "谷雨", 
      "立夏", "小满", "芒种", "夏至", 
      "小暑", "大暑", "立秋", "处暑", 
      "白露", "秋分", "寒露", "霜降", 
      "立冬", "小雪", "大雪", "冬至"
  ];
  var tmp1 = new Date(
      (31556925974.7 * (yyyy-1900) + sTermInfo[mm*2+1]*60000) + 
      Date.UTC(1900,0,6,2,5)
  );
  var tmp2 = tmp1.getUTCDate();
  var solarTerms = "";
  if (tmp2 === dd) solarTerms = solarTerm[mm*2+1];
  tmp1 = new Date(
      (31556925974.7*(yyyy-1900) + sTermInfo[mm*2]*60000) + 
      Date.UTC(1900,0,6,2,5)
  );
  tmp2 = tmp1.getUTCDate();
  if (tmp2 === dd) {
      solarTerms = solarTerm[mm*2]
  };
  return solarTerms;
};
module.exports.specialResolveSD = function (str, yyyy) {
  let mth = str.match(/(.*)第(.*)个(.*)\./);
  let ref = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let ref_ = [0, 1, 2, 3, 4, 5, 6];
  let month = parseInt(mth[1]), idx = parseInt(mth[2]), day = ref.indexOf(mth[3]);
  let firstDayIs = new Date(`${yyyy}/${month}/${1}`).getDay(),
    MonthDayTotNum = new Date(yyyy, month, 0).getDate(),
    c = 0, result = 0;
  if(isNaN(idx)){
    var r = 0;
    for (; result<MonthDayTotNum; result++) {
      ref_[(firstDayIs+result)%7] === day && (r=result);
    }
    return `${yyyy}/${month}/${r+1}`;
  }else{
    for (; result<MonthDayTotNum; result++) {
      ref_[(firstDayIs+result)%7] === day && c++;
      if(c===idx) break;
    }
    return `${yyyy}/${month}/${result+1}`;
  }
}
module.exports.getChuXi = function (yyyy) {
  var start = new Date(yyyy, 0, 19).valueOf(), end = new Date(yyyy, 1, 20).valueOf();
  const aday = 86400000;
  var result = start;
  for (; result<=end; result+=aday) {
    var tmpDate = new Date(result);
    var obj = sloarToLunar(yyyy, tmpDate.getMonth()+1, tmpDate.getDate());
    if (obj.lunarMonth === "正" && obj.lunarDay === "初一") break;
  }
  const ChuXi = new Date(result-aday);
  return `${yyyy}/${ChuXi.getMonth()+1}/${ChuXi.getDate()}`
}
module.exports.getHanShi = function (yyyy) {
  return getYearsSolarTerm(yyyy, "清明", 1)
};
module.exports.getYearsSolarTerm = getYearsSolarTerm;
function getYearsSolarTerm (yyyy, solarTerm, offset=0) {
  const info = {
    "小寒": ["01/05", "06"], "大寒": ["01/19", "21"], "立春": ["02/03", "04"], "雨水": ["02/18", "19"], 
    "惊蛰": ["03/05", "06"], "春分": ["03/20", "21"], "清明": ["04/04", "06"], "谷雨": ["04/19", "20"], 
    "立夏": ["05/05", "06"], "小满": ["05/20", "22"], "芒种": ["06/05", "06"], "夏至": ["06/21", "22"], 
    "小暑": ["07/07", "08"], "大暑": ["07/22", "23"], "立秋": ["08/06", "09"], "处暑": ["08/22", "24"], 
    "白露": ["09/07", "08"], "秋分": ["09/22", "24"], "寒露": ["10/07", "09"], "霜降": ["10/23", "24"], 
    "立冬": ["11/07", "08"], "小雪": ["11/22", "23"], "大雪": ["12/07", "08"], "冬至": ["12/21", "23"]
  };
  let range = info[solarTerm];
  if(!range) return;
  let mth = range[0].match(/(.*)\/(.*)/), m = mth[1]-1;
  var start = new Date(yyyy, m, mth[2]).valueOf(), end = new Date(yyyy, m, range[1]).valueOf();
  const aday = 86400000;
  var result = start;
  for (; result<=end; result+=aday) {
    var tmpDate = new Date(result);
    // var obj2 = sloarToLunar(yyyy, tmpDate.getMonth()+1, tmpDate.getDate());
    // console.log(obj2)
    var obj = getSolarTerm(yyyy, tmpDate.getMonth()+1, tmpDate.getDate());
    if (obj === solarTerm) break;
  }
  const term = new Date(result-aday*offset);
  return `${yyyy}/${term.getMonth()+1}/${term.getDate()}`
};
module.exports.joint = joint;
function joint (json){
  var empty = [];
  for(var key in json){
      empty.push(key + "=" + json[key]);
  }
  return empty.join("&");
};
module.exports.scrollToCh_Ele = scrollToCh_Ele;
function scrollToCh_Ele (fa_ele, ch_ele, buf, dur, fn) {
  let scrollLength = ch_ele.getBoundingClientRect().top - fa_ele.getBoundingClientRect().top + buf||0;
  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
  };
  var scrollTo = function(element, to, duration){
      var start = element.scrollTop,
          change = to - start,
          currentTime = 0,
          increment = 20;
          
      var animateScroll = function(){
          currentTime += increment;
          var val = Math.easeInOutQuad(currentTime, start, change, duration);
          element.scrollTop = val;
          if(currentTime < duration) {
              setTimeout(animateScroll, increment);
          }
      };
      animateScroll();
      fn && fn();
  };
  scrollTo(fa_ele, scrollLength, dur)
};
module.exports.AjaxRequest = AjaxRequest;
function AjaxRequest(){var req=new Object();req.timeout=null;req.generateUniqueUrl=true;req.url=window.location.href;req.method="GET";req.async=true;req.username=null;req.password=null;req.parameters=new Object();req.requestIndex=AjaxRequest.numAjaxRequests++;req.responseReceived=false;req.groupName=null;req.queryString="";req.responseText=null;req.responseXML=null;req.status=null;req.statusText=null;req.aborted=false;req.xmlHttpRequest=null;req.onTimeout=null;req.onLoading=null;req.onLoaded=null;req.onInteractive=null;req.onComplete=null;req.onSuccess=null;req.onError=null;req.onGroupBegin=null;req.onGroupEnd=null;req.xmlHttpRequest=AjaxRequest.getXmlHttpRequest();if(req.xmlHttpRequest==null){return null;}req.xmlHttpRequest.onreadystatechange=function(){if(req==null||req.xmlHttpRequest==null){return;}if(req.xmlHttpRequest.readyState==1){req.onLoadingInternal(req);}if(req.xmlHttpRequest.readyState==2){req.onLoadedInternal(req);}if(req.xmlHttpRequest.readyState==3){req.onInteractiveInternal(req);}if(req.xmlHttpRequest.readyState==4){req.onCompleteInternal(req);}};req.onLoadingInternalHandled=false;req.onLoadedInternalHandled=false;req.onInteractiveInternalHandled=false;req.onCompleteInternalHandled=false;req.onLoadingInternal=function(){if(req.onLoadingInternalHandled){return;}AjaxRequest.numActiveAjaxRequests++;if(AjaxRequest.numActiveAjaxRequests==1&&typeof(window['AjaxRequestBegin'])=="function"){AjaxRequestBegin();}if(req.groupName!=null){if(typeof(AjaxRequest.numActiveAjaxGroupRequests[req.groupName])=="undefined"){AjaxRequest.numActiveAjaxGroupRequests[req.groupName]=0;}AjaxRequest.numActiveAjaxGroupRequests[req.groupName]++;if(AjaxRequest.numActiveAjaxGroupRequests[req.groupName]==1&&typeof(req.onGroupBegin)=="function"){req.onGroupBegin(req.groupName);}}if(typeof(req.onLoading)=="function"){req.onLoading(req);}req.onLoadingInternalHandled=true;};req.onLoadedInternal=function(){if(req.onLoadedInternalHandled){return;}if(typeof(req.onLoaded)=="function"){req.onLoaded(req);}req.onLoadedInternalHandled=true;};req.onInteractiveInternal=function(){if(req.onInteractiveInternalHandled){return;}if(typeof(req.onInteractive)=="function"){req.onInteractive(req);}req.onInteractiveInternalHandled=true;};req.onCompleteInternal=function(){if(req.onCompleteInternalHandled||req.aborted){return;}req.onCompleteInternalHandled=true;AjaxRequest.numActiveAjaxRequests--;if(AjaxRequest.numActiveAjaxRequests==0&&typeof(window['AjaxRequestEnd'])=="function"){AjaxRequestEnd(req.groupName);}if(req.groupName!=null){AjaxRequest.numActiveAjaxGroupRequests[req.groupName]--;if(AjaxRequest.numActiveAjaxGroupRequests[req.groupName]==0&&typeof(req.onGroupEnd)=="function"){req.onGroupEnd(req.groupName);}}req.responseReceived=true;req.status=req.xmlHttpRequest.status;req.statusText=req.xmlHttpRequest.statusText;req.responseText=req.xmlHttpRequest.responseText;req.responseXML=req.xmlHttpRequest.responseXML;if(typeof(req.onComplete)=="function"){req.onComplete(req);}if(req.xmlHttpRequest.status==200&&typeof(req.onSuccess)=="function"){req.onSuccess(req);}else if(typeof(req.onError)=="function"){req.onError(req);}delete req.xmlHttpRequest['onreadystatechange'];req.xmlHttpRequest=null;};req.onTimeoutInternal=function(){if(req!=null&&req.xmlHttpRequest!=null&&!req.onCompleteInternalHandled){req.aborted=true;req.xmlHttpRequest.abort();AjaxRequest.numActiveAjaxRequests--;if(AjaxRequest.numActiveAjaxRequests==0&&typeof(window['AjaxRequestEnd'])=="function"){AjaxRequestEnd(req.groupName);}if(req.groupName!=null){AjaxRequest.numActiveAjaxGroupRequests[req.groupName]--;if(AjaxRequest.numActiveAjaxGroupRequests[req.groupName]==0&&typeof(req.onGroupEnd)=="function"){req.onGroupEnd(req.groupName);}}if(typeof(req.onTimeout)=="function"){req.onTimeout(req);}delete req.xmlHttpRequest['onreadystatechange'];req.xmlHttpRequest=null;}};req.process=function(){if(req.xmlHttpRequest!=null){if(req.generateUniqueUrl&&req.method=="GET"){req.parameters["AjaxRequestUniqueId"]=new Date().getTime()+""+req.requestIndex;}var content=null;for(var i in req.parameters){if(req.queryString.length>0){req.queryString+="&";}req.queryString+=encodeURIComponent(i)+"="+encodeURIComponent(req.parameters[i]);}if(req.method=="GET"){if(req.queryString.length>0){req.url+=((req.url.indexOf("?")>-1)?"&":"?")+req.queryString;}}req.xmlHttpRequest.open(req.method,req.url,req.async,req.username,req.password);if(req.method=="POST"){if(typeof(req.xmlHttpRequest.setRequestHeader)!="undefined"){req.xmlHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');}content=req.queryString;}if(req.timeout>0){setTimeout(req.onTimeoutInternal,req.timeout);}req.xmlHttpRequest.send(content);}};req.handleArguments=function(args){for (var i in args){if(typeof(req[i])=="undefined"){req.parameters[i]=args[i];}else{req[i]=args[i];}}};req.getAllResponseHeaders=function(){if(req.xmlHttpRequest!=null){if(req.responseReceived){return req.xmlHttpRequest.getAllResponseHeaders();}alert("Cannot getAllResponseHeaders because a response has not yet been received");}};req.getResponseHeader=function(headerName){if(req.xmlHttpRequest!=null){if(req.responseReceived){return req.xmlHttpRequest.getResponseHeader(headerName);}alert("Cannot getResponseHeader because a response has not yet been received");}};return req;}AjaxRequest.getXmlHttpRequest=function(){if(window.XMLHttpRequest){return new XMLHttpRequest();}else if(window.ActiveXObject){}else{return null;}};AjaxRequest.isActive=function(){return(AjaxRequest.numActiveAjaxRequests>0);};AjaxRequest.get=function(args){AjaxRequest.doRequest("GET",args);};AjaxRequest.post=function(args){AjaxRequest.doRequest("POST",args);};AjaxRequest.doRequest=function(method,args){if(typeof(args)!="undefined"&&args!=null){var myRequest=new AjaxRequest();myRequest.method=method;myRequest.handleArguments(args);myRequest.process();}};AjaxRequest.submit=function(theform, args){var myRequest=new AjaxRequest();if(myRequest==null){return false;}var serializedForm=AjaxRequest.serializeForm(theform);myRequest.method=theform.method.toUpperCase();myRequest.url=theform.action;myRequest.handleArguments(args);myRequest.queryString=serializedForm;myRequest.process();return true;};AjaxRequest.serializeForm=function(theform){var els=theform.elements;var len=els.length;var queryString="";this.addField=function(name,value){if(queryString.length>0){queryString+="&";}queryString+=encodeURIComponent(name)+"="+encodeURIComponent(value);};for (var i=0; i<len; i++){var el=els[i];if(!el.disabled){switch(el.type){case'text':case'password':case'hidden':case'textarea':this.addField(el.name,el.value);break;case'select-one':if(el.selectedIndex>=0){this.addField(el.name,el.options[el.selectedIndex].value);}break;case'select-multiple':for (var j=0; j<el.options.length; j++){if(el.options[j].selected){this.addField(el.name,el.options[j].value);}}break;case'checkbox':case'radio':if(el.checked){this.addField(el.name,el.value);}break;}}}return queryString;};AjaxRequest.numActiveAjaxRequests=0;AjaxRequest.numActiveAjaxGroupRequests=new Object();AjaxRequest.numAjaxRequests=0;