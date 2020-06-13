let searchtext = document.querySelector('.search #search_from > input');
let searchbtn = document.querySelector('.search-btn');
let information = document.querySelector('.information'); //当前天气div
let forecast = document.querySelector(".forecast"); //获取天气预报 div
let lifestyle = document.querySelector('.lifestyle');
    if (localStorage.tq == undefined) {   /*如果默认没搜索过 就自动搜索普宁*/
    var tqList = [];
    let defauleCity = "普宁";
    autorend(defauleCity);
    } else {  /*如果有搜索记录，就自动搜索最后一次机城市*/
    var tqList = JSON.parse(localStorage.tq);
    let endcityName = tqList[tqList.length - 1].cityName;
    autorend(endcityName);
}

    /* 自动渲染方法*/
    function autorend (cityName) {
    let nowurl = "https://free-api.heweather.net/s6/weather/now?location="+cityName+"&key=26be256aca2c43a7bb7f9a72e0f99a6b";
    let dailyurl = "https://free-api.heweather.net/s6/weather/forecast?location="+cityName+"&key=26be256aca2c43a7bb7f9a72e0f99a6b";
    let lifestyleurl = "https://free-api.heweather.net/s6/weather/lifestyle?location="+cityName+"&key=26be256aca2c43a7bb7f9a72e0f99a6b";
        console.log("执行自动渲染")
    rendweather(nowurl,cityName,dailyurl,lifestyleurl);
}

    function getTime() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let house = date.getHours();
        house = house < 10 ? '0' + house : house;
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let second = date.getMinutes();
        second = second < 10 ? '0' + second : second;
        let time = year + "年 - " +  month + "月 - " + day + "日 - " + house + ":" + minutes + ":" + second;
        return time;
    }

    /*搜索按钮事件*/
    searchbtn.addEventListener('click',function () {
    let time = getTime();
    let cityName = searchtext.value;
    /*如果输入框不为空才执行  不加这条件 会导致传入一个空的字符串 导致历史记录添加到一个空的*/
    if (cityName != "") {
        let List = {
            "cityName" : cityName,
            "time" : time
        }
        tqList.push(List);
        localStorage.tq = JSON.stringify(tqList);
        rendhistory(tqList);
        let nowurl = "https://free-api.heweather.net/s6/weather/now?location="+cityName+"&key=26be256aca2c43a7bb7f9a72e0f99a6b";
        let dailyurl = "https://free-api.heweather.net/s6/weather/forecast?location="+cityName+"&key=26be256aca2c43a7bb7f9a72e0f99a6b";
        let lifestyleurl = "https://free-api.heweather.net/s6/weather/lifestyle?location="+cityName+"&key=26be256aca2c43a7bb7f9a72e0f99a6b";
        rendweather(nowurl,cityName,dailyurl,lifestyleurl);  /*调用渲染方法*/
        searchtext.value = "";
    }
});

    /*手机键盘搜索键事件*/
    document.getElementById('search_from').onsubmit = function () {
        searchbtn.click();
        document.activeElement.blur();
    }

    /*主页面渲染*/
    function rendweather (nowurl,cityName,dailyurl,lifestyleurl) {
        /*获取今日天气信息*/
        getAjax(nowurl,function (xhr) {
            let databoj = JSON.parse(xhr.response);
            let now = databoj.HeWeather6[0].now;
            if (now == undefined) {  /* 如果获取到的为now   说明用户输入的城市有误*/
                if (tqList.length > 1) {//如果长度大于1 说明之前用户正确输入过城市
                    tqList.splice(tqList.length - 1 , 1 );  //执行删除最后一个元素  即输入错误的城市
                    rendhistory(tqList);  //  执行历史记录渲染
                    cityName = tqList[tqList.length - 1].cityName;   //将城市名赋值为数组最后一个元素 即最后一次正确搜索的城市
                } else if (tqList.length == 1) {  /* 如果长度为1 说明现在为止用户没输入一个正确的城市*/
                    cityName = "普宁";  //将城市名赋值为 普宁
                    // tqList.splice(tqList.length - 1 , 1 );
                    tqList.pop();  //删除输入错误的文字
                    rendhistory(tqList);  //执行历史记录渲染
                }
                autorend(cityName);  //最后执行自动渲染
            } else {  //如果以上都没错误 说明用户输入的城市正确  正常执行代码
                /* 渲染今日天气*/
                information.innerHTML = `
            <div class="now">
            <span class="city">${cityName}</span>
            <div class="situation">
                <img src="https://cdn.heweather.com/cond_icon/${now.cond_code}.png" alt="">      <!-- 天气图标 -->
                <h1 class="text">${now.cond_txt}</h1> <!-- 天气状况 -->
                <div class="temp">
                    <h3 class="tmp">温度:${now.tmp}℃</h3>        <!-- 温度 -->
                    <h3 class="fl">体感温度:${now.fl}℃</h3>         <!-- 体感温度 -->
                </div>
            </div>
        `;
                /*渲染背景图片*/
                let nowcondtxt = now.cond_code;
                switch(nowcondtxt) {
                    case "101":
                    case "102":
                    case "103":
                    case "104":
                        document.body.style.backgroundImage = "url('images/2.jpg')";
                        break;
                    case "100":
                    case "200":
                    case "201":
                    case "202":
                    case "203":
                    case "204":
                        document.body.style.backgroundImage = "url('images/1.jpg')";
                        break;
                    case "205":
                    case "206":
                    case "207":
                    case "208":
                    case "209":
                        document.body.style.backgroundImage = "url('images/7.jpg')";
                        break;
                    case "210":
                    case "211":
                    case "212":
                    case "213":
                        document.body.style.backgroundImage = "url('images/8.jpg')";
                        break;
                    case "300":
                    case "301":
                    case "302":
                    case "303":
                    case "304":
                    case "305":
                    case "306":
                    case "307":
                    case "308":
                    case "309":
                    case "310":
                    case "311":
                    case "312":
                    case "313":
                    case "314":
                    case "315":
                    case "316":
                    case "317":
                    case "318":
                    case "399":
                        document.body.style.backgroundImage = "url('images/3.jpg')";
                        break;
                    case "400":
                    case "401":
                    case "402":
                    case "403":
                    case "404":
                    case "405":
                    case "406":
                    case "407":
                    case "408":
                        document.body.style.backgroundImage = "url('images/4.jpg')";
                        break;
                    case "500":
                    case "501":
                    case "502":
                    case "503":
                    case "504":
                    case "505":
                    case "506":
                    case "507":
                    case "508":
                        document.body.style.backgroundImage = "url('images/5.jpg')";
                        break;
                    case "509":
                    case "510":
                    case "511":
                    case "512":
                    case "513":
                    case "514":
                    case "515":
                        document.body.style.backgroundImage = "url('images/6.jpg')";
                        break;
                    default:
                        document.body.style.backgroundImage = "url('images/9.jpg')";
                }

                /*获取天气预告信息*/
                getAjax(dailyurl,function (xhr) {
                    forecast.innerHTML = "";  /*清除之前的渲染*/
                    let databoj = JSON.parse(xhr.response);
                    let daily = databoj.HeWeather6[0].daily_forecast;
                    daily.forEach(function (item,index) {
                        /*如果当天天气早上和晚上一样就输出一个  如果不一样 就早上转晚上（天气类型）*/
                        var txt =  item.cond_txt_d == item.cond_txt_n ? item.cond_txt_d : item.cond_txt_d + "转" + item.cond_txt_n;
                        let date = '今天';  /*默认今天*/
                        if (index == 1) {  /* 第二个赋值为明天*/
                            date = "明天";
                        } else if (index == 2) {  /* 第三个赋值为后天*/
                            date = "后天";
                        }
                        /*渲染天气预报*/
                        forecast.innerHTML += `
                    <div class="nowday forecast-item">
                             <div class="forecast-situation">
                             <img src="https://cdn.heweather.com/cond_icon/${item.cond_code_d}.png" alt="">
                             ${date} * <span class="txt">${txt}</span>
                     </div>
                         <div class="forecast-temp">
                                <span class="max">${item.tmp_max}°/</span>
                                <span class="min">${item.tmp_min}°</span>
                         </div>
            </div>`;
                    })
                });

                lifestyle.style.display = 'block'; /*显示生活指数模板*/
                /*获取生活指数*/
                getAjax(lifestyleurl,function (xhr) {
                    let databoj = JSON.parse(xhr.response);
                    let lifestyle = databoj.HeWeather6[0].lifestyle;
                    lifestyleclick(lifestyle);  /*调用生活指数渲染方法*/
                });
            }
        });
    }

    /*生活指数渲染方法*/
    let lifestyleitem = document.querySelectorAll('.lifestyle-item');
    function lifestyleclick (lifestyle) {
        for (let j = 0; j < lifestyleitem.length; j ++) {
            lifestyleitem[j].onclick = function () {
                let index = lifestyleitem[j].dataset.indexs;
                let li = lifestyle[index];
                let lifestyletc = document.querySelector('.lifestyle-tc');
                lifestyletc.innerHTML = `<div class="fanghui">
                         <img src="images/fanghui.png" alt="">
                                            </div>
                         <h2>${lifestyleitem[j].children[1].childNodes[0].data}</h2>
                         <span>${li.brf}</span>
                         <p>"${li.txt}"</p>`;
                lifestyletc.style.display = 'block';
                /*关闭按钮*/
                let fanghuibtn = document.querySelector('.fanghui');
                console.log(fanghuibtn);
                fanghuibtn.onclick = function () {
                    lifestyletc.style.display = 'none';
                }
            }
        }
    }


    //历史记录事件
    let historys = document.querySelector('.historys');
    function rendhistory(tqList) {
        historys.innerHTML = "";  /*每次执行历史记录渲染都清除之前的记录 防止出现重复*/
        tqList.forEach(function (item,index) {
            /*将历史记录写入*/
            historys.innerHTML += `
            <div class="history-item" data-indexs="${index}">
                <span class="history-time">${item.time}</span>
                <span class="history-city">${item.cityName}</span>
             </div>
            `;
        })

        /*获取历史记录div 添加点击事件
        * 点击后跳转点击的城市
        * */
        let historyitem = document.querySelectorAll('.history-item');
        for (let j = 0; j < historyitem.length; j ++) {
            historyitem[j].onclick = function() {
                let index = historyitem[j].dataset.indexs;
                let thecityName = tqList[index].cityName;
                let time = getTime();
                let List = {
                    "cityName" : thecityName,
                    "time" : time
                }
                tqList.push(List);
                localStorage.tq = JSON.stringify(tqList);
                rendhistory(tqList);
                autorend(thecityName);
            }
        }
    }
    rendhistory(tqList);
    xiala();
    //下拉菜单事件
    function xiala () {
        let historybtn = document.querySelector('.la > img');
        let historyDiv = document.querySelector('.history');
        let clearhistory = document.querySelector('.clearbtn');
        let flag = true;
        historybtn.addEventListener('click',function () {
            if (flag) {
                flag = false;
                historybtn.style.backgroundColor = "rgba(0,0,0,.3)";
                let height = (tqList.length * 0.4) + 1.7;
                historyDiv.style.height = height + 'rem';
            } else {
                flag = true;
                historybtn.style.backgroundColor = "rgba(0,0,0,.0)";
                historyDiv.style.height = '0.9rem';
            }
        });
        clearhistory.addEventListener('click',function () { /*清除历史记录事件*/
            localStorage.removeItem('tq'); /*删除本地存储*/
            tqList = []; /*将数组清空*/
            rendhistory(tqList);  /*渲染历史记录*/
            historybtn.click();  /*执行下拉按钮点击*/
        });
        searchtext.addEventListener('click',function () { //点击输入框 如果下拉菜单打开 就关闭
            if (!flag) {
                historybtn.click();
            }
        });
    }
