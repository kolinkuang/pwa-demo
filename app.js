// 用下面的模板生成了content中的内容
const template = "<article>\n\
    <!--<img src='img/SLUG.jpg' alt='NAME'>-->\n\
    <h3>#POS. NAME</h3>\n\
    <ul>\n\
    <li><span>Author:</span> <strong>AUTHOR</strong></li>\n\
    <li><span>Twitter:</span> <a href='https://twitter.com/TWITTER'>@TWITTER</a></li>\n\
    <li><span>Website:</span> <a href='http://WEBSITE/'>WEBSITE</a></li>\n\
    <li><span>GitHub:</span> <a href='https://GITHUB'>GITHUB</a></li>\n\
    <li><span>More:</span> <a href='http://js13kgames.com/entries/SLUG'>js13kgames.com/entries/SLUG</a></li>\n\
    </ul>\n\
</article>";
let content = '';
for (let i = 0; i < games.length; i++) {
    let entry = template.replace(/POS/g, (i + 1))
        .replace(/SLUG/g, games[i].slug)
        .replace(/NAME/g, games[i].name)
        .replace(/AUTHOR/g, games[i].author)
        .replace(/TWITTER/g, games[i].twitter)
        .replace(/WEBSITE/g, games[i].website)
        .replace(/GITHUB/g, games[i].github);
    entry = entry.replace('<a href=\'http:///\'></a>', '-');
    content += entry;
}
document.getElementById('content').innerHTML = content;

//注册了一个service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/pwa-examples/sw.js').then(registration => {
        return registration.pushManager.getSubscription()
            .then(async subscription => {
                // 注册部分
                if(subscription) {
                    return subscription;
                }
            });
    })
        .then(async subscription => {
            // 订阅部分
            const response = await fetch('./vapidPublicKey');
            const vapidPublicKey = await response.text();
            // const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
            // return registration.pushManager.subscribe({
            //     userVisibleOnly: true,
            //     applicationServerKey: convertedVapidKey
            // });
        });
}

//点击按钮时请求用户授权，用来向用户推送通知
const button = document.getElementById("notifications");
button.addEventListener('click', async () => {
    const result = await Notification.requestPermission();
    if (result === 'granted') {
        randomNotification();
    }
});

// 创建通知的代码，它会随机展示游戏列表中的一个项目
function randomNotification() {
    const randomItem = Math.floor(Math.random() * games.length);
    const notifTitle = games[randomItem].name;
    const notifBody = 'Created by ' + games[randomItem].author + '.';
    const notifImg = 'data/img/' + games[randomItem].slug + '.jpg';
    const options = {
        body: notifBody,
        icon: notifImg
    }
    const notif = new Notification(notifTitle, options);
    setTimeout(randomNotification, 30000);
}