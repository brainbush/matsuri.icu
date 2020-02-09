<template>
    <div class="row">
        <div class="col-12">
            <hr>
        </div>
        <div class="container container-row">
            <div class="row">
                <router-link :to="{name:'channel',params:{channel:channel.bilibili_uid}}">
                    <img class="image_container" alt="" :src="face">
                </router-link>
                <div class="col ml-4">
                    <div class="row">
                        <h5>{{channel.name}}
                            <a target="_blank" rel="noopener noreferrer" :href="live_url"
                               v-if="channel.is_live" class="badge badge-primary">直播中</a></h5>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="row">
                                <div class="tag_name">上次直播</div>
                            </div>
                            <div class="row">
                                <div class="tag_value pt-1" :title="last_live_hover">{{last_live}}</div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="row">
                                <div class="tag_name">上次直播弹幕数</div>
                            </div>
                            <div class="row">
                                <div class="tag_value pt-1">{{last_danmu}}</div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="row">
                                <div class="tag_name">累计收录片段数</div>
                            </div>
                            <div class="row">
                                <div class="tag_value pt-1">{{total_clips}}</div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="row">
                                <div class="tag_name">累计弹幕数</div>
                            </div>
                            <div class="row">
                                <div class="tag_value pt-1">{{total_danmu}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "CardChannelList",
        props: {
            channel: Object
        },
        computed: {
            face: function () {
                return this.channel.face + '@256h_256w'
            },
            live_url: function () {
                if (this.channel.hasOwnProperty('bilibili_live_room'))
                    return 'https://live.bilibili.com/' + this.channel.bilibili_live_room
                return ''
            },
            last_live: function () {
                let timestamp = this.channel.last_live;
                if(timestamp === null) return '无';
                if (this.$moment().diff(timestamp, 'days') > 7) {
                    return this.$moment(timestamp).format('YYYY年MM月DD日');
                }
                return this.$moment(timestamp).fromNow();
            },
            last_live_hover: function () {
                return this.$moment(this.channel.last_live).format('YYYY/M/D H:mm:ss');

            },
            total_clips: function () {
                if (this.channel.total_clips > 0)
                    return this.channel.total_clips;
                return '无'
            },
            last_danmu: function () {
                let last_danmu = this.channel.last_danmu;
                if (last_danmu === null) {
                    return '无'
                }
                return last_danmu + '条'
            },
            total_danmu: function () {
                let total_danmu = this.channel.total_danmu;
                if (total_danmu === null) {
                    return '无'
                }
                return total_danmu + '条'
            }
        }
    }
</script>

<style scoped>

    .image_container {
        width: 100px;
        height: 100px;
        background-size: cover;
        border-radius: 5%;
    }

    .badge {
        margin-left: 5px;
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
</style>