<template>
    <div>
        <div class="container">
            <div class="d-flex flex-wrap">
                <a :href="space" target="_blank" rel="noopener noreferrer"><img class="image_container_channel"
                                                                                alt="" :src="face"></a>
                <div class="mid ms-2" v-if="channel_name">
                    <a :href="space" target="_blank" rel="noopener noreferrer"><h3>{{channel_name}}</h3></a>
                </div>
                <div class="w-100 d-sm-none mt-3"/>
                <div class="mid ms-sm-auto">
                    <div class="float-right">
                        <label>状态：
                            <div class="btn-group">
                                <button v-on:click="list()" id="on_button" type="button"
                                        class="btn btn-outline-primary active">直播
                                </button>
                                <button v-on:click="off_list()" id="off_button" type="button"
                                        class="btn btn-outline-primary">下播
                                </button>
                            </div>
                        </label>
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
            <ClipList v-for="clip in display_clips" :clip="clip" :detail_view="false" :viewer_view="false"
                      :webp_support="webp_support" :key="clip.id"/>
        </div>
        <div v-else>
            <OffComments :uid="channel"/>
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
                channel_info: {},
                channel: parseInt(this.$route.params.channel),
                clip_list: [],
                online_clips: true,
                webp_support: this.$parent.webp_support,
                showed: 20
            }
        },
        created() {
            let channel_list = JSON.parse(localStorage.getItem('channel_list'));
            if (channel_list === null)
                return;
            let channel_info = channel_list.find(x => x.bilibili_uid === this.channel);
            if (channel_info !== undefined) this.channel_info = channel_info;
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
                url = 'https://api.matsuri.icu/channel/' + this.channel.toString() + '/clips';
                this.$http
                    .get(url)
                    .then(function (response) {
                        if (response.data.status === 0) {
                            this.clip_list = response.data.data;
                            this.$parent.loading = false;
                        }
                    }.bind(this))
            },
            scrollFunc() {
                if (document.body.clientHeight - window.scrollY - window.innerHeight < (document.body.clientHeight / this.showed)) {
                    if (this.showed < this.clip_list.length)
                        this.showed += 10;
                }
            }
        },
        mounted() {
            window.addEventListener('scroll', this.scrollFunc);
            if (Object.entries(this.channel_info).length === 0) {
                console.log('Fetch channel info');
                this.$http
                    .get('https://api.matsuri.icu/channel/' + this.channel.toString())
                    .then(function (response) {
                        if (response.data.status === 0) {
                            this.channel_info = response.data.data;
                        }
                    }.bind(this))
            }
            this.get_list();

        },
        computed: {
            space: function () {
                return 'https://space.bilibili.com/' + this.channel
            },
            channel_name: function () {
                if (this.channel_info) {
                    document.title = this.channel_info.name + ' - ICU for Viewers'
                    return this.channel_info.name;
                }
                return null
            },
            face: function () {
                if (this.channel_info)
                    if (this.webp_support) {
                        return this.channel_info.face + '@200h_200w.webp'
                    } else {
                        return this.channel_info.face + '@200h_200w'
                    }
                return null
            },
            display_clips: function () {
                return this.clip_list.filter((clip, index) => index < this.showed)
            }
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