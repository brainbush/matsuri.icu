<template>
    <div>
        <ClipList :clip="clip_info" v-if="Object.entries(clip_info).length" :detail_view="true"/>
        <div class="row">
            <div class="col">
                <ve-line :data="chartData"/>
            </div>
        </div>
        <div class="col-12">
            <hr>
        </div>
        <div class="container comment-container" v-if="show_comments">
            <div class="row">
                <div class="col text-left">
                    <h3>全部弹幕</h3>
                </div>
                <div class="col text-right mid">
                    <div class="btn-group mr-2">
                        <button type="button" v-on:click="list_status(0)" id="state0"
                                class="btn btn-outline-primary active">全部
                        </button>
                        <button type="button" v-on:click="list_status(1)" id="state1" class="btn btn-outline-primary">
                            翻译man
                        </button>
                        <button type="button" v-on:click="list_status(2)" id="state2" class="btn btn-outline-primary">
                            礼物
                        </button>
                    </div>
                </div>
            </div>
            <LiveComment v-for="comment in comments_showed" :comment="comment" :key="comment.i" :viewer_view="false"/>
        </div>
        <div class="container text-center" v-else>
            <button class="btn btn-primary" v-on:click="get_comments">显示所有弹幕</button>
        </div>
    </div>
</template>

<script>
    import ClipList from "@/components/ClipList";
    import LiveComment from "@/components/LiveComment";
    import VeLine from 'v-charts/lib/line.min'

    export default {
        name: "Detail",
        components: {ClipList, LiveComment, VeLine},
        data() {
            return {
                id: this.$route.params.id,
                data: {},
                showed: 500,
                state: 0,
                full_comments: [],
                show_comments: false
            }
        },
        computed: {
            chartData: function () {
                let rows = [];
                let columns = [];
                if (this.highlights.length) {
                    rows = this.highlights;
                    columns = Object.keys(rows[0]);
                    rows.forEach(row => row.time = this.$moment(row.time).format('H:mm'));
                }
                return {columns: columns, rows: rows};
            },
            clip_info: function () {
                if (this.data.hasOwnProperty('start_time')) {
                    return {
                        bilibili_uid: this.data.bilibili_uid,
                        name: this.data.name,
                        cover: this.data.cover,
                        start_time: this.data.start_time,
                        end_time: this.data.end_time,
                        live: this.data.live,
                        title: this.data.title,
                        id: this.data.id,
                        total_danmu: this.data.total_danmu,
                        danmu_density: this.data.danmu_density,
                        total_gift: this.data.total_gift,
                        total_superchat: this.data.total_superchat,
                        total_reward: this.data.total_reward
                    };
                } else return {}
            },
            highlights: function () {
                if (this.data.hasOwnProperty('highlights')) {
                    return this.data.highlights
                } else return [];
            },
            comments_showed_full: function () {
                if (this.state === 0) {
                    return this.full_comments;
                } else if (this.state === 1) {
                    // 可它实在是太慢了!
                    // let re = RegExp('(^【)+(.*)+(】+$)');
                    // return this.full_comments.filter(comment => re.test(comment.text))
                    return this.full_comments.filter(comment => {
                        if (comment.hasOwnProperty('text'))
                            return (comment.text.startsWith('【') & comment.text.endsWith('】')) |
                                (comment.text.startsWith('（') & comment.text.endsWith('）'));
                        return false;
                    })
                } else
                    return this.full_comments.filter(comment => comment.hasOwnProperty('gift_name') || comment.hasOwnProperty('superchat_price'));
            },
            comments_showed: function () {
                return this.comments_showed_full.filter((comment, index) => index < this.showed)
            }
        },
        mounted() {
            this.$parent.loading = true;
            window.addEventListener('scroll', this.scrollFunc);
            this.$http
                .get('https://api.neeemooo.com/clip/' + this.id)
                .then(function (response) {
                    if (response.data.status === 0) {
                        this.data = response.data.data;
                        this.$parent.loading = false;
                    }
                }.bind(this))
        },
        methods: {
            scrollFunc() {
                if (document.body.clientHeight - window.scrollY - window.innerHeight < (document.body.clientHeight / this.showed)) {
                    if (this.showed < this.comments_showed_full.length)
                        this.showed += 500;
                }
            },
            list_status: function (state) {
                if (state === this.state)
                    return;
                document.getElementById('state' + this.state.toString()).classList.remove('active');
                document.getElementById('state' + state.toString()).classList.add('active');
                this.state = state;
                this.showed = 500;
            },
            get_comments: function () {
                this.show_comments = true;
                this.$parent.loading = true;
                this.$http
                    .get('https://api.neeemooo.com/clip/' + this.id + '/comments')
                    .then(function (response) {
                        if (response.data.status === 0) {
                            let full_comments = [];
                            response.data.data.forEach(function (comment, i) {
                                comment.i = i;
                                full_comments.push(comment)
                            });
                            this.full_comments = full_comments;
                            this.$parent.loading = false;
                        }
                    }.bind(this))

            }
        }
    }
</script>

<style scoped>
    .comment-container {
        padding: 5px 15px;
    }

    .mid {
        margin-top: auto;
        margin-bottom: auto;
    }
</style>