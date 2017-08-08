/**
 * Created by hugh on 2017/8/7.
 */

//判断是否支持sw，是的话监听load事件，注册sw文件
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw-test/sw.js', {scope: '/sw-test/'})
            .then(function (registration) {

                // 注册成功
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function (err) {

                // 注册失败:(
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}