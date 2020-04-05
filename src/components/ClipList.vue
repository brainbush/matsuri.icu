<template>
    <div>
        <div class="container container-row">
            <div class="row">
                <div v-if="!this.clip.end_time || this.detail_view">
                    <img class="image_container_clip_list" alt="" :src="cover">
                </div>
                <div v-else>
                    <router-link :to="{name:'detail',params:{id:clip.id}}">
                        <img class="image_container_clip_list" alt="" :src="cover">
                    </router-link>
                </div>

                <div class="col ml-4">
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
        <div class="row">
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
            detail_view: Boolean
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
                if (this.clip.cover === '')
                    return '/no-cover.jpg';
                return this.clip.cover + '@180h_320w'
            },
            start_time: function () {
                if (this.clip.hasOwnProperty('start_time'))
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
                return this.clip.total_danmu
            },
            danmu_density: function () {
                if (this.clip.hasOwnProperty('danmu_density'))
                    return this.clip.danmu_density;
                return 0;
            },
            total_gift: function () {
                if (this.clip.hasOwnProperty('total_gift'))
                    return this.clip.total_gift;
                return 0;
            },
            total_superchat: function () {
                if (this.clip.hasOwnProperty('total_superchat'))
                    return this.clip.total_superchat;
                return 0;
            },
            total_reward: function () {
                if (this.clip.hasOwnProperty('total_reward'))
                    return this.clip.total_reward;
                return 0;
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