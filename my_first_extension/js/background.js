

// 注意: `chrome - settings - extensions - your extension -- inspect views` ,单击打开这个页面, `console.log` 语句将结果打印在这里

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
        callback(faxhr.responseTextlse);
    }
    xhr.send();
}


// 定时访问,并根据状态动态修改显示的图标
var currentStatus = true;
var count = 1;
setInterval(function () {
    httpRequest('https://www.baidu.com/', function () {
        currentStatus = !currentStatus;
        count++;

        // 设置图标
        chrome.browserAction.setIcon({ path: 'image/' + (currentStatus ? 'chrome_h.png' : 'chrome_h2.png') });

        // 设置badge信息,如消息条数等,正常大概能显示4个字符左右,比如用于提示消息数量,若是超过999,一般就显示为 '999+'
        // 另外,badge不支持修改文字颜色,始终为白色
        chrome.browserAction.setBadgeBackgroundColor({ color: '#0000ff' });
        if (count <= 999) {
            chrome.browserAction.setBadgeText({ text: "" + count });
        } else {
            chrome.browserAction.setBadgeText({ text: "999+" });
        }

        // 设置默认名称,鼠标悬浮在图标上时弹出的提示语
        if (count % 5 == 0) {
            chrome.browserAction.setTitle({ title: "可以写个'正'了" });
        } else {
            chrome.browserAction.setTitle({ title: "继续努力" });
        }
    });
}, 5000);


// 创建右键菜单
// 选中链接时,弹出的右键菜单选项
var link = chrome.contextMenus.create({
    "title": "您选择了一个链接",
    "contexts": ["link"],
    "onclick": genericOnClick
});

var selection = chrome.contextMenus.create({
    "title": "您选中的是一串文字,点击给出提醒",
    "contexts": ["selection"],
    "onclick": selectionOnClick
});

function genericOnClick(info, tab) {
    alert(info.linkUrl);
}

function selectionOnClick(info, tab) {
    showNotification();
}

// 在屏幕右下角显示提醒,类似android的toast
var myNotificationId = "100";
function showNotification() {
    var opt = {
        type: "list",
        title: "友情提醒",
        message: "msg",
        iconUrl: "image/chrome.png",
        // 文字列表
        items: [{ title: "1.", message: "五点半该下班了" },
            { title: "2.", message: "记得按时吃饭" }],
        //按钮功能,设置标题和图片
        buttons: [{ title: "call", iconUrl: "image/call.png" }, { title: "email", iconUrl: "image/email.png" }]
    }
    chrome.notifications.create(myNotificationId, opt, function (id) { console.log("notifacition created ,id : " + id); })
}

// 处理用户点击notification按钮事件
chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
    if (notifId === myNotificationId) {
        if (btnIdx === 0) {//第一个按钮
            alert("您拨打的电话暂时无人接听,请稍后再拨...");
        } else if (btnIdx === 1) {
            alert("发送邮件成功");
        }
    }
});

// 通知栏消失或者被用户手动关闭时触发该监听
chrome.notifications.onClosed.addListener(function () {
    console.log("通知栏已关闭");
});

// 操作cookies
chrome.cookies.get({
    url: 'https://www.baidu.com',
    name: 'BAIDUID'
}, function (cookie) {
    console.log("your Baidu id : " + cookie.value);
});