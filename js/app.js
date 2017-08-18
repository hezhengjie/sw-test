/**
 * Created by hugh on 2017/8/8.
 */

!(function(){
    fetch('https://m.51ping.com/beauty/medical/content/article/ajax/getcontents?tagid=0&pageno=1&pagesize=10&source=dp').then((res)=>{
        if(res.status==200){
            return res.json();
        }
    }).then((data)=>{
        console.log(data)
    })
})();
