<template>
    <div>
        <div class="container">
            <div class="row container">
                <img class="image_container_channel" alt="" :src="face">
                <div class="col mid" v-if="chanel_name">
                    <h3>{{chanel_name}}</h3>
                </div>
                <div class="col mid">
                    <div class="row float-right">
                        <h6 class="mid">状态：</h6>
                        <div class="btn-group">
                            <button v-on:click="list()" id="on_button" type="button"
                                    class="btn btn-outline-primary active">直播
                            </button>
                            <button v-on:click="off_list()" id="off_button" type="button"
                                    class="btn btn-outline-primary">下播
                            </button>
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
        <div v-if="online_clips">
            <ClipList v-for="clip in clip_list" :clip="clip" :detail_view="false" :key="clip.id"/>
        </div>
        <div v-else>
            <OffComments :uid="channel"></OffComments>
        </div>
    </div>
</template>

<script>
    import ClipList from "@/components/ClipList";
    import OffComments from "@/views/OffComments";

    export default {
        name: "Channel",
        components: {ClipList, OffComments},
        data() {
            return {
                // state: 0,
                channel_info: {},
                channel: parseInt(this.$route.params.channel),
                clip_list: [],
                online_clips: true
            }
        },
        created() {
            let channel_list = JSON.parse(localStorage.getItem('channel_list'));
            if (channel_list === null)
                return;
            this.channel_info = channel_list.find(x => x.bilibili_uid === this.channel)
        },
        methods: {
            list: function () {
                if (this.online_clips)
                    return;
                document.getElementById('off_button').classList.remove('active');
                document.getElementById('on_button').classList.add('active');
                this.online_clips = true;
                this.get_list();
            },
            off_list: function () {
                if (!this.online_clips)
                    return;
                document.getElementById('on_button').classList.remove('active');
                document.getElementById('off_button').classList.add('active');
                this.online_clips = false;
            },
            get_list: function () {
                let url;
                this.$parent.loading = true;
                url = 'https://api.neeemooo.com/channel/' + this.channel.toString() + '/clips';

                this.$http
                    .get(url)
                    .then(function (response) {
                        if (response.data.status === 0) {
                            this.clip_list = response.data.data;
                            this.$parent.loading = false;
                        }
                    }.bind(this))
            }
        },
        mounted() {
            if (Object.entries(this.channel_info).length === 0) {
                console.log('Fetch channel info');
                this.$http
                    .get('https://api.neeemooo.com/channel/' + this.channel.toString())
                    .then(function (response) {
                        if (response.data.status === 0) {
                            this.channel_info = response.data.data;
                        }
                    }.bind(this))
            }
            this.get_list(0);

        },
        computed: {
            chanel_name: function () {
                if (this.channel_info) {
                    return this.channel_info.name;
                }
                return null
            },
            face: function () {
                if (this.channel_info)
                    return this.channel_info.face + '@200h_200w';
                return null
            },
        }
    }
</script>

<style scoped>
    .image_container_channel {
        width: 100px;
        height: 100px;
        background-size: cover;
        border-radius: 50%;
    }

    .mid {
        margin-top: auto;
        margin-bottom: auto;
    }
</style>