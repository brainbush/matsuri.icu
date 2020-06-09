<template>
    <div>
        <ClipList :clip="clip_info" v-if="Object.entries(clip_info).length" :webp_support="webp_support"
                  :detail_view="true" :viewer_view="false"/>
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
                    <button type="button" v-on:click="download_danmu()" class="btn btn-info mr-2">导出全部弹幕</button>
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
            <div class="row pt-2" v-if="state===2">
                <div class="col">
                    <div class="form-group">
                        <input type="checkbox" id="gift_filter_checkbox" v-model="filter_checkbox">
                        <label for="gift_filter_checkbox">隐藏小于
                            <input type="number" style="max-width: 80px;display: inline" class="form-control pl-2 pr-2"
                                   step="0.1" v-model="filter_price">元的礼物
                        </label>
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
                show_comments: false,
                webp_support: this.$parent.webp_support,
                filter_checkbox: false,
                filter_price: 0.1
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
                    document.title = this.data.title + ' - ' + this.data.name + ' - ICU for Viewers'
                    let info = Object.assign({}, this.data)
                    delete info.highlights
                    return info;
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
                } else {
                    if (this.filter_checkbox) {
                        let comments_with_price = this.full_comments.filter(comment => comment.hasOwnProperty('gift_name') || comment.hasOwnProperty('superchat_price'));
                        return comments_with_price.filter(comment => comment.gift_price > this.filter_price || comment.superchat_price > this.filter_price)
                    } else {
                        return this.full_comments.filter(comment => comment.hasOwnProperty('gift_name') || comment.hasOwnProperty('superchat_price'));
                    }

                }
            },
            comments_showed: function () {
                return this.comments_showed_full.filter((comment, index) => index < this.showed)
            }
        },
        mounted() {
            document.title = 'ICU for Viewers';
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
            },
            download_danmu: function () {
                let blob = new Blob([JSON.stringify({
                    info: this.clip_info,
                    full_comments: this.full_comments
                })], {type: 'application/json'});
                let blob_url = window.URL.createObjectURL(blob);
                let file_name = this.clip_info.name + '_' + this.clip_info.title + '_' + this.clip_info.start_time + '.json'
                let blob_link = document.createElement('a');
                blob_link.href = blob_url;
                blob_link.download = file_name;
                blob_link.click();
                window.URL.revokeObjectURL(blob_url);
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