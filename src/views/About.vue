<template>
    <div class="pt-3">
        <h1>关于</h1>
        <div class="row">
            <div class="col-4">
                <hr>
            </div>
        </div>
        <div class="container">
            <p>一个非常Anti的站
                （一不小心致敬了
                <a target="_blank" rel="noopener noreferrer"
                   href="https://mamedaifuku.sakura.ne.jp/live_stream/html/index.html">豆大福</a>的样子）<s>明明功能比人家少那么多</s>。
            </p>
            <p>Source：&nbsp;
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/brainbush/matsuri.icu">前端</a>&nbsp;
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/brainbush/api.matsuri.icu">后端</a>&nbsp;
                <s>孩子第一次用 Vue 和 Express 写的东西不太好……</s></p>
            <p>一般情况下直播间下播后1分钟左右都会更新，如果遇到问题请联系B站私信ID
                <a target="_blank" rel="noopener noreferrer"
                   href="https://message.bilibili.com/#whisper/mid186629"><code>186629</code></a>
                或者 Telegram:
                <a target="_blank" rel="noopener noreferrer" href="https://t.me/brainbush"><code>@brainbush</code></a>。
            </p>
            <p>目前各种完善中可能遇到不稳定的情况请见谅！</p>
            <p>如果有需要增加收录的也可以点<a target="_blank" rel="noopener noreferrer" href="https://add.matsuri.icu/">这里</a>或者通过上面的方式联系！</p>
            <p>数据库压力大大大&nbsp;已经换成PostgreSQL了，估计会好一些
            <br>旧MongoDB的数据：<code>magnet:?xt=urn:btih:29A01036F0EEED880EB94A471D87C3FC7D4BAE92</code>（2020年2月至2021年1月31日）
            <br><s>快做成管人观众发言语料库</s></p>
            <br>要抓也就抓吧，也设置一下频率吧，一秒用IP池发100多个请求谁撑得住啊！
            <p>程序力非常弱可能一堆乱七八糟的情况也请见谅！</p>
            <p class="pt-3">其实一开始只是随手看到群里的大佬提出来：做一个统计直播弹幕的内容方便录播组剪辑打灯之类的吧！</p>
            <p>然后就这样愉快的做出来了，然后貌似还是半自动不太好用<s>以及一些奇奇怪怪的Bug</s>，干脆就一条龙服务吧！</p>
            <p>关于“观看人数“：数据是从弹幕发言、礼物、b站进入通知（xxx进入/关注/分享了直播间）的所有人数加在一起后以B站UID去重获得，真实的数据应该会更多不会更少wwww</p>
            <p>礼物是包括送礼和舰长哒！（是按照打折后的价格来哒）</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AboutPage",
        mounted(){
            document.title = '关于 - ICU for Viewers'
        }
    }
</script>

<style scoped>

</style>
