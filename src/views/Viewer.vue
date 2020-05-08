<template>
    <div>
        <div v-for="(clip,index) in data" :key="index">
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
                data: {},
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
    }
</script>

<style scoped>
    .comment-container {
        padding: 5px 15px;
    }
</style>