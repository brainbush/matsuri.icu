<template>
    <div>
        <div v-for="clip in display_result" :key="clip.clip_info.id">
            <ClipList :clip="clip.clip_info" :detail_view="true" :webp_support="webp_support"/>
            <div class="container comment-container">
                <LiveComment v-for="(comment,index) in clip.full_comments" :key="index" :comment="comment"
                             :viewer_view="true"/>
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
                showed: 20,
                webp_support: this.$parent.webp_support
            }
        },
        mounted() {
            this.$parent.loading = true;
            window.addEventListener('scroll', this.scrollFunc);
            this.$http
                .get('https://api.neeemooo.com/viewer/' + this.id)
                .then(function (response) {
                    if (response.data.status === 0) {
                        this.data = response.data.data;
                        this.$parent.loading = false;
                    }
                }.bind(this))
        },
        computed: {
            display_result: function () {
                return this.data.filter((clip, index) => index < this.showed)
            }
        },
        methods: {
            scrollFunc() {
                if (document.body.clientHeight - window.scrollY - window.innerHeight < (document.body.clientHeight / this.showed)) {
                    if (this.showed < this.data.length)
                        this.showed += 10;
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