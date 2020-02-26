<template>
    <div class="container">
        <ClipList :clip="clip_info" v-if="Object.entries(clip_info).length" :detail_view="true"/>
        <div class="row">
            <div class="col">
                <ve-line :data="chartData"/>
            </div>
        </div>
        <div class="row"></div>
        <div class="col-12">
            <hr>
        </div>
        <div class="container comment-container">
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
                state: 0
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
                if (this.data.hasOwnProperty('clip_info'))
                    return this.data.clip_info;
                else return {}
            },
            clip_detail: function () {
                if (this.data.hasOwnProperty('clip_detail'))
                    return this.data.clip_detail;
                else return {}
            },
            highlights: function () {
                if (this.clip_detail.hasOwnProperty('highlights')) {
                    return this.clip_detail.highlights
                } else return [];
            },
            full_comments: function () {
                if (this.clip_detail.hasOwnProperty('full_comments')) {
                    let full_comments = [];
                    this.clip_detail.full_comments.forEach(function (comment, i) {
                        comment.i = i;
                        full_comments.push(comment)
                    });
                    return full_comments
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
                            return comment.text.startsWith('【') & comment.text.endsWith('】');
                        return false;
                    })
                } else
                    return this.full_comments.filter(comment => comment.hasOwnProperty('gift_name'));
            },
            comments_showed: function () {
                return this.comments_showed_full.filter((comment, index) => index < this.showed)
            }
        },
        mounted() {
            window.addEventListener('scroll', this.scrollFunc);
            this.$http
                .get('https://api.neeemooo.com/clip/' + this.id)
                .then(function (response) {
                    if (response.data.status === 0) {
                        this.data = response.data.data;
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