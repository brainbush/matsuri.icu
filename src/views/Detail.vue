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
            <h3>全部弹幕</h3>
            <LiveComment v-for="(comment,index) in comments_showed" :comment="comment" :key="index"
                         :viewer_view="false"/>

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
                showed: 500
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
                    return this.clip_detail.full_comments
                } else return [];
            },
            comments_showed: function () {
                return this.full_comments.filter((comment, index) => index < this.showed)
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
                    if (this.showed < this.full_comments.length)
                        this.showed += 500;
                }
            }
        }
    }
</script>

<style scoped>
    .comment-container {
        padding: 5px 15px;
    }
</style>