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

$(document).ready(function () {
    // 查询ip
    httpRequest('http://pv.sohu.com/cityjson?ie=utf-8', function (ip) {
        // 'var returnCitySN = {"cip": "110.86.16.42", "cid": "350200", "cname": "福建省厦门市"};'
        var ipBean = JSON.parse(ip.split("=")[1].replace(";", ""));
        // document.getElementById('ip_div').innerText = "您的ip : " + ipBean.cip;
        $('#ip_div').text("您的ip: " + ipBean.cip);
    });

    // 查询天气
    httpRequest('http://flash.weather.com.cn/wmaps/xml/xiamen.xml', function (weathder) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(weathder, "text/xml"); 1
        // document.getElementById('weather_div').innerText = "厦门天气: " + xmlDoc.getElementsByTagName('city')[0].getAttribute('windState');
        $('#weather_div').text("厦门天气: " + xmlDoc.getElementsByTagName('city')[0].getAttribute('windState'));
    });

    var targetPermission = {
        permissions: ['tabs'],
        origins: ['http://www.jianshu.com/']
    };
    // 动态申请权限
    $('#ip_div').click(function () {
        chrome.permissions.contains(targetPermission, function (result) {
            if (result) {
                // The extension has the permissions.
                alert("您已获得过该权限,不需要再申请,将进行移除...");
                removePermission();
            } else {
                // The extension doesn't have the permissions.
                requestPermission();
            }
        });
    });

    // 申请权限
    function requestPermission() {
        chrome.permissions.request(targetPermission, function (granted) {
            alert('申请权限时候成功 :  ' + granted);
        });
    }


    // 移除权限
    function removePermission() {
        chrome.permissions.remove(targetPermission, function (removed) {
            alert("移除权限是否成功: " + removed);
        });
    }

});


