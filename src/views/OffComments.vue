<template>
    <div>
        <div class="container">
            <div class="form-inline d-flex mb-3">
                <label for="off_comment_date" class="col-form-label p-2">日期：</label>
                <DatePicker id="off_comment_date" value-type="format" format="YYYY-MM-DD" v-on:change="get_off_comments"
                            :clearable="false" v-model="comment_date_input"/>
                <div class="btn-group me-2 ms-auto">
                    <button type="button" v-on:click="list_status(0,false)" id="state0"
                            class="btn btn-outline-primary active">全部
                    </button>
                    <button type="button" v-on:click="list_status(1,false)" id="state1" class="btn btn-outline-primary">
                        礼物
                    </button>
                </div>
            </div>
            <LiveComment v-for="comment in comments_showed" v-bind:comment="comment"
                         :key="comment_date_input+comment.i" :viewer_view="true"/>
        </div>
    </div>
</template>

<script>
    import LiveComment from "@/components/LiveComment";
    import DatePicker from "vue2-datepicker"
    import 'vue2-datepicker/locale/zh-cn';

    function time_compare(a, b) {
        return a.time - b.time;
    }

    export default {
        name: "OffComments",
        components: {LiveComment, DatePicker},
        props: {
            uid: Number
        }, data() {
            return {
                comment_date_input: "",
                data: {},
                showed: 500,
                state: 0,
                comments_showed_full: [],
            }
        }, mounted() {
            window.addEventListener('scroll', this.scrollFunc);
        },
        computed: {
            full_comments: function () {
                if (this.data.hasOwnProperty('comments')) {
                    let comments = this.data.comments;
                    comments.sort(time_compare);
                    let full_comments = [];
                    comments.forEach(function (comment, i) {
                        comment.i = i;
                        full_comments.push(comment)
                    });
                    return full_comments;
                }
                return []
            },
            comments_showed: function () {
                return this.comments_showed_full.filter((comment, index) => index < this.showed)
            }
        },
        methods: {
            get_off_comments: function () {
                if (this.comment_date_input === "")
                    return;
                let date = this.comment_date_input.replace(/-/g, '');
                this.$parent.$parent.loading = true;
                let url = 'https://api.neeemooo.com/off_comments/' + this.uid.toString() + '/' + date;
                this.$http.get(url).then(function (response) {
                    if (response.data.status === 0) {
                        this.$parent.$parent.loading = false;
                        if (response.data.data) {
                            this.data = response.data.data;
                        } else {
                            this.data = {}
                        }
                        this.list_status(0, true)
                    }
                }.bind(this))
            },
            scrollFunc() {
                if (document.body.clientHeight - window.scrollY - window.innerHeight < (document.body.clientHeight / this.showed)) {
                    if (this.showed < this.comments_showed_full.length)
                        this.showed += 500;
                }
            },
            list_status: function (state, refresh) {
                if (state === this.state && refresh === false)
                    return;
                document.getElementById('state' + this.state.toString()).classList.remove('active');
                document.getElementById('state' + state.toString()).classList.add('active');
                this.state = state;
                this.showed = 500;
                if (state === 0) {
                    this.comments_showed_full = this.full_comments;
                } else {
                    this.comments_showed_full = this.full_comments.filter(comment => comment.hasOwnProperty('gift_name') || comment.hasOwnProperty('superchat_price'));
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "~vue2-datepicker/scss/index.scss";
</style>
<style scoped>
    @media (max-width: 540px) {
        .mx-datepicker {
            width: 150px
        }
    }
</style>