/**
 * Created by hugh on 2017/8/7.
 */
var CACHE_VERSION = 'app-v1'; // 缓存文件的版本
var CACHE_FILES = [ // 需要缓存的页面文件
    'js/app.js',
    'css/style.css'
];


self.addEventListener('install', function (event) { // 监听worker的install事件
    event.waitUntil( // 延迟install事件直到缓存初始化完成
        new Promise(function() {
            caches.open(CACHE_VERSION)
                .then(function (cache) {
                    console.log('Opened cache');
                    return cache.addAll(CACHE_FILES);
                })
            self.skipWaiting();//更新sw时
        })
    );
});

self.addEventListener('activate', function (event) { // 监听worker的activate事件
    event.waitUntil( // 延迟activate事件直到
        Promise.all([
        // 更新客户端
        self.clients.claim(),
        caches.keys().then(function(keys){
            return Promise.all(keys.map(function(key, i){ // 清除旧版本缓存
                if(key !== CACHE_VERSION){
                    return caches.delete(keys[i]);
                }
            }))
        })]
    )
    )
});

self.addEventListener('fetch', function (event) { // 截取页面的资源请求
    event.respondWith( // 返回页面的资源请求
        caches.match(event.request).then(function(res){ // 判断缓存是否命中
            if(res){  // 返回缓存中的资源
                return res;
            }
            requestBackend(event); // 执行请求备份操作
        })
    )
});

function requestBackend(event){  // 请求备份操作
    var request = event.request.clone(); // 把原始请求拷过来
    return fetch(request).then(function (httpRes) {

        // http请求的返回已被抓到，可以处置了。
        console.log(httpRes);

        // 请求失败了，直接返回失败的结果就好了。。
        if (!httpRes || httpRes.status !== 200) {
            return httpRes;
        }
        // 请求成功的话，将请求缓存起来。
        var responseClone = httpRes.clone();
        caches.open(CACHE_VERSION).then(function (cache) {
            cache.put(event.request, responseClone);
        });

        return httpRes;
    });
}