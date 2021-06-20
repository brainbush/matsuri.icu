<template>
    <div>
        <div v-for="clip in data" :key="clip.clip_info.id">
            <ClipList :clip="clip.clip_info" :detail_view="true" :viewer_view="true" :webp_support="webp_support"/>
            <div class="container comment-container">
                <LiveComment v-for="(comment,index) in clip.full_comments" :key="index" :comment="comment"
                             :viewer_view="true"/>
            </div>
            <div class="col-12">
                <hr>
            </div>
            <div class="pb-3"/>
        </div>
    </div>
</template>

<script>
import ClipList from "@/components/ClipList";
import LiveComment from "@/components/LiveComment";

export default {
    name: "Viewer",
    components: {ClipList, LiveComment},
    data() {
        return {
            id: this.$route.params.id,
            data: [],
            showed: 10,
            is_end: false,
            page: 0,
            webp_support: this.$parent.webp_support
        }
    },
    mounted() {
        document.title = 'ICU for Viewers'
        this.$parent.loading = true;
        this.load_more();
        window.addEventListener('scroll', this.scrollFunc);
    },
    methods: {
        scrollFunc() {
            if (document.body.clientHeight - window.scrollY - window.innerHeight < (document.body.clientHeight / this.showed)) {
                if (!this.is_end && !this.$parent.loading) {
                    window.removeEventListener('scroll', this.scrollFunc);
                    this.load_more();
                    this.showed += 10;
                    window.addEventListener('scroll', this.scrollFunc);
                }
            }
        },
        load_more() {
            this.$parent.loading = true;
            this.$http
            .get(`https://api.matsuri.icu/viewer/${this.id}?page=${++this.page}`)
            .then(function (response) {
                if (response.data.status === 0) {
                    this.data = this.data.concat(response.data.data);
                    if (response.data.data.length === 0)
                        this.is_end = true;
                    if (response.data.data.length > 0 && document.title === 'ICU for Viewers') document.title = this.data[0].full_comments[0].username + ' - ICU for Viewers';
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
</style>