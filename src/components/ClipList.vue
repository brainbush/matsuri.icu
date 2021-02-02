<template>
    <div>
        <div class="container container-row">
            <div class="d-flex flex-wrap">
                <div v-if="!this.clip.end_time || this.detail_view">
                    <img class="image_container_clip_list" alt="" :src="cover">
                </div>
                <div v-else>
                    <router-link :to="{name:'detail',params:{id:clip.id}}">
                        <img class="image_container_clip_list" alt="" :src="cover">
                    </router-link>
                </div>
                <div class="w-100 d-sm-none"/>
                <div class="col ms-0 ms-sm-4">
                    <div class="row">
                        <div v-if="!this.clip.end_time || this.detail_view">
                            <h5>{{clip.title}}</h5>
                        </div>
                        <div v-else>
                            <router-link :to="{name:'detail',params:{id:clip.id}}">
                                <h5>{{clip.title}}</h5>
                            </router-link>
                        </div>
                    </div>
                    <div class="row">
                        <div v-if="detail_view" class="col-12 col-sm-6 col-md">
                            <div class="row">
                                <div class="tag_name">频道</div>
                            </div>
                            <div class="row">
                                <a :href="space" target="_blank" rel="noopener noreferrer">
                                    <div class="tag_value">{{channel_name}}</div>
                                </a>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md">
                            <div class="row">
                                <div class="tag_name">开始</div>
                            </div>
                            <div class="row">
                                <div class="tag_value">{{start_time}}</div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md">
                            <div class="row">
                                <div class="tag_name">结束</div>
                            </div>
                            <div class="row">
                                <div class="tag_value">{{end_time}}</div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md">
                            <div class="row">
                                <div class="tag_name">弹幕</div>
                            </div>
                            <div class="row">
                                <div class="tag_value">{{total_danmu}}</div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md">
                            <div class="row">
                                <div class="tag_name">观看人数</div>
                            </div>
                            <div class="row">
                                <div class="tag_value">{{total_views}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row pt-1" v-if="this.detail_view">
                        <div class="col-12 col-sm-6 col-md">
                            <div class="row">
                                <div class="tag_name">弹幕密度</div>
                            </div>
                            <div class="row">
                                <div class="tag_value">{{danmu_density}}个/分钟</div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md">
                            <div class="row">
                                <div class="tag_name">礼物收益</div>
                            </div>
                            <div class="row">
                                <div class="tag_value">￥{{total_gift}}</div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md">
                            <div class="row">
                                <div class="tag_name">SuperChat收益</div>
                            </div>
                            <div class="row">
                                <div class="tag_value">￥{{total_superchat}}</div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md">
                            <div class="row">
                                <div class="tag_name">合计收益</div>
                            </div>
                            <div class="row">
                                <div class="tag_value">￥{{total_reward}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="!viewer_view">
            <div class="col-12">
                <hr>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ClipList",
    props: {
        clip: Object,
        detail_view: Boolean,
        webp_support: Boolean,
        viewer_view: Boolean
    },
    computed: {
        space: function () {
            return 'https://space.bilibili.com/' + this.clip.bilibili_uid
        },
        channel_name: function () {
            return this.clip.name
        },
        live: function () {
            return this.clip.live
        },
        status: function () {
            if (!this.end_time) {
                if (this.live) {
                    return '直播中'
                } else {
                    return '下播中'
                }
            } else {
                if (this.live) {
                    return '直播'
                } else {
                    return '下播'
                }
            }
        },
        cover: function () {
            if (this.clip.cover === null || this.clip.cover === '')
                return '/no-cover.jpg';
            if (this.webp_support) {
                return this.clip.cover + '@180h_320w.webp'
            } else {
                return this.clip.cover + '@180h_320w'
            }
        },
        start_time: function () {
            if (this.clip.hasOwnProperty('start_time'))
                if (this.clip.start_time !== null)
                    return this.$moment(this.clip.start_time).format('YYYY/M/D H:mm:ss');
            return '';
        },
        end_time: function () {
            if (!this.clip.end_time)
                return '';
            return this.$moment(this.clip.end_time).format('YYYY/M/D H:mm:ss')
        },
        total_danmu: function () {
            if (!this.clip.end_time)
                return '不可用';
            return this.clip.total_danmu || 0
        },
        total_views: function () {
            if (!this.clip.end_time)
                return '不可用'
            if (this.clip.hasOwnProperty('views')) {
                if (this.clip.views != null)
                    return this.clip.views
                else return '不可用'
            } else return '不可用'
        },
        danmu_density: function () {
            return this.clip.danmu_density || 0;
        },
        total_gift: function () {
            return this.clip.total_gift || 0;
        },
        total_superchat: function () {
            return this.clip.total_superchat || 0;
        },
        total_reward: function () {
            return this.clip.total_reward || 0;
        }
    }
}
</script>

<style scoped>
.image_container_clip_list {
    height: 90px;
    background-size: cover;
    border-radius: 5%;
}

.container-row {
    padding-left: 30px;
    padding-right: 30px;
}

.tag_name {
    color: rgba(0, 0, 0, .45);
    font-size: 13px;
}

.tag_value {
    font-size: 20px;
}

a:link {
    text-decoration: none;
    color: #212529;
}

a:active {
    text-decoration: blink;
    color: #212529;
}

a:hover {
    text-decoration: underline;
    color: #212529;
}

a:visited {
    text-decoration: none;
    color: #212529;
}

</style>