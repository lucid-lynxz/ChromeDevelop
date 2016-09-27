// 通用网络请求函数
function httpRequest(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.onerror = function () {
        callback(xhr.responseText);
    }
    xhr.send();
}

// 查询ip
httpRequest('http://pv.sohu.com/cityjson?ie=utf-8', function (ip) {
    // 'var returnCitySN = {"cip": "110.86.16.42", "cid": "350200", "cname": "福建省厦门市"};'
    var ipBean = JSON.parse(ip.split("=")[1].replace(";", ""));
    document.getElementById('ip_div').innerText = "您的ip : " + ipBean.cip;
});

// 查询天气
httpRequest('http://flash.weather.com.cn/wmaps/xml/xiamen.xml', function (weathder) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(weathder, "text/xml");
    document.getElementById('weather_div').innerText = "厦门天气: " + xmlDoc.getElementsByTagName('city')[0].getAttribute('windState');
});
