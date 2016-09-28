先上一张效果图:
![extension_effect.gif](https://raw.githubusercontent.com/lucid-lynxz/markdownPhotos/master/chrome_extension/effect.gif)

# 结构
![arc.png](https://raw.githubusercontent.com/lucid-lynxz/markdownPhotos/master/chrome_extension/arc.png)

## 几个概念
![extension_effect.gif](https://raw.githubusercontent.com/lucid-lynxz/markdownPhotos/master/chrome_extension/effect.png)

从上图可以看出围绕在extension中的几个可见UI元素:
`icon` : extension的默认图标
`badge` : 标记,可以显示最多4个字符的信息,类似于手机软件中的未读消息数目
`toolTip` :　右图中当鼠标悬浮在 icon 上方时弹出的提示信息
`popup` : 用户点击 icon 时,extension 展示给用户看的页面

一个扩展需要这么几个文件:
manifest.json , popup.html , background.js, icon.png

## [manifest.json](https://developer.chrome.com/extensions/manifest)
清单文件,用于声明一些元数据的json格式文件,可以包含扩展名,描述,版本号,权限等,
另外, `manifest.json` 还指明了两个主要文件: `default_popup` 和 `background -> scripts`:
```manifest.json
{
    "manifest_version": 2, // 2 好像是固定的

    // 以下是显示在 `chrome-settings-extensions` 中的信息
    "name": "my_extension",
    "version": "1.0",
    "description": "学习js,学习chrome插件制作demo",

    // 默认图标,可以设置不同尺寸,chrome会根据实际情况适配
    "icons": {
        "16": "image/chrome.png"
    },

    // 根据google给出的tip,若是在大多数页面可见的话就用browserAction,否则推荐page_action
    "browser_action": {
        "default_icon": {
            "16": "image/chrome.png"
        },
        "default_title": "Chrome扩展demo", //鼠标悬浮时显示的提示名称
        "default_popup": "popup.html" // 点击图标时弹出的页面
    },

    // 常驻后台,可选
    "background": {
        // 指定后台运行的脚本
        // 右键菜单功能选项也可以在里面添加
        "scripts": [
            "js/background.js"
        ]
    },
    "permissions": [ //权限限制
        //允许访问的网站
        "http://flash.weather.com.cn/",
        "https://www.baidu.com/",
        "http://pv.sohu.com/",

        // 将扩展加入到右键菜单中,需要添加 `contextMenus` 权限
        // 同时还要设置 `icons` 域生命16像素尺寸的图标，右键菜单才会显示出扩展的图标
        "contextMenus",

        //　添加桌面提醒
        "notifications",

        // 操作cookies,需要添加权限以及可操作的域(不限制: `<all_urls>`),此处会允许上面生命的几个域数据
        "cookies"
    ]
}
```

## default_popup
该属性指定了用户点击扩展图标时,浏览器会弹出的展示页面,就是普通的html页面;<br>
**注意**: google规定脚本需要从外部引用,如下面中的 `script` 标签就是从外部导入了 `get_info.js`;
```html
<html>
<head></head>
<body>
    <div id="ip_div">正在获取您的ip……</div>
    <div id="weather_div">正在查询天气……</div>
    <script src="js/get_info.js"></script>
</body>
</html>
```

## background.scripts
这个属性定义了可以在后台运行的脚本,脚本中可以操作 `default_popup` 定义的展示页面,定时获取数据,发出notification等;

## [icons ,  browser_action.default_icon](https://developer.chrome.com/extensions/browserAction)
定义显示的图标,可有多个尺寸定义,chrome会根据屏幕分辨率来选择或适配;<br>
图标最大可以被显示成19dp的方形区域,更大的图标会动态改变大小以适配;<br>
可以使用普通的图片文件也可以使用html5的 [canvas element](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html) 来动态生成;<br>
可以使用任意WebKit支持的图片:bmp,gif,ico,jpeg,png等,但对于未解压的扩展包,图片只能使用png格式;

## google tips
For the best visual impact, follow these guidelines:
* Do use browser actions for features that make sense on most pages.
* Don't use browser actions for features that make sense for only a few pages. Use page actions instead.
* Do use big, colorful icons that make the most of the 38x38-pixel space. Browser action icons should seem a little bigger and heavier than page action icons.
* Don't attempt to mimic Google Chrome's monochrome menu icon. That doesn't work well with themes, and anyway, extensions should stand out a little.
* Do use alpha transparency to add soft edges to your icon. Because many people use themes, your icon should look nice on a variety of background colors.
* Don't constantly animate your icon. That's just annoying.

## 常用方法:
```get_info.js
// 设置 extension 的图标
chrome.browserAction.setIcon({ path: 'image/' + (ifOnline ? 'online.png' : 'offline.png') });

// 设置tooltip
chrome.browserAction.setTitle({ title: "继续努力" });

// 设置badge背景颜色
chrome.browserAction.setBadgeBackgroundColor({ color: '#0000ff' });

// 设置badge文字
chrome.browserAction.setBadgeText({ text: "999+" });
```
# 加载extension程序
1. 在chrome地址栏中输入: `chrome://extensions/` 或者通过 `settings - extensions` 打开设置页面;
2. 启用 `developer mode` , 并通过 `load unpacked extension...` 来加载本地项目文件夹就可以了;
![setting_extension.png](https://raw.githubusercontent.com/lucid-lynxz/markdownPhotos/master/chrome_extension/setting_extension.png)

# 其他操作
![notification.gif](https://raw.githubusercontent.com/lucid-lynxz/markdownPhotos/master/chrome_extension/notification.gif)

## 创建右键菜单选项
![content_menu.png](https://raw.githubusercontent.com/lucid-lynxz/markdownPhotos/master/chrome_extension/content_menu.png)
1. 在 `manifest.json` 中声明权限和icon图标
```manifest.json
{
    "icons": {
        "16": "image/chrome.png"
    },
    "permissions": [ 
        "contextMenus"
    ]

}
```
2. 在 `background.script` 指定的脚本中创建menucontent选项
```js
var link = chrome.contextMenus.create({
    "title": "您选中的是一串文字,点击给出提醒", // 右键菜单显示信息
    "contexts": ["selection"], // 鼠标选择文本时才生效
    "onclick": genericOnClick // 点击事件
});
function genericOnClick(info, tab) {
    ...
    showNotification();
}
```

## 创建右下角通知栏
![notification.png](https://raw.githubusercontent.com/lucid-lynxz/markdownPhotos/master/chrome_extension/notification.gif)

1. 在 `manifest.json` 中生命权限
```json
  "permissions": [ 
        "notifications"
    ]
```
2. 在 `background.script` 指定的脚本中设置notificationId以及options:
```js
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
    //创建并显示
    chrome.notifications.create(myNotificationId, opt, function (id) { console.log("notifacition created ,id : " + id); })
}
```
3. 设置按钮点击事件
```js
chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
    if (notifId === myNotificationId) {
        if (btnIdx === 0) {//第一个按钮
            ...
        } else if (btnIdx === 1) {
            ...
        }
    }
});
```
4. 设置通知框消失监听事件
```js
chrome.notifications.onClosed.addListener(function () {
    console.log("通知栏已关闭");
});
```

## [申请权限](https://developer.chrome.com/extensions/permissions)
确定哪些权限为可选权限后,在 `manifest.json` 中声明,可选权限会弹出确认框让用户确认:
```manifest.json
"optional_permissions": [ "tabs", "http://www.jianshu.com/" ],
```
> 你能声明的optional权限有:
host permissions,background'bookmarks,clipboardRead,clipboardWrite,contentSettings,contextMenus,cookies,debugger,history,idle,management,notifications,pageCapture,tabs,topSites,webNavigation,webRequest,webRequestBlocking

然后在用户手势动作事件中动态申请权限:
```js
$('#click_div').click(function () {
    chrome.permissions.request({
        permissions: ['tabs'],
        origins: ['http://www.jianshu.com/']
    }, function (granted) {
        // The callback argument will be true if the user granted the permissions.
        alert('result :  ' + granted);
    });
});

// 补充
chrome.permissions.contains(targetPermisson,callback);// 判断是否拥有某权限
chrome.permissions.remove(targetPermisson,callback);// 删除权限
```



# 相关名词汇总及资料推荐
[manifest.json](https://developer.chrome.com/extensions/manifest)   
[browserAction](https://developer.chrome.com/extensions/browserAction)
[pageAction](https://developer.chrome.com/extensions/pageAction)

[图灵社区 : Chrome扩展及应用开发](http://www.ituring.com.cn/minibook/950)
[C好rome Developer's Guide](https://developer.chrome.com/extensions/devguide)