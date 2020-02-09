<template>
    <div class="container">
        <div v-for="(clip,index) in data" :key="index">
            <ClipList :clip="clip.clip_info" :detail_view="true"/>
            <div class="row"></div>
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
                data: {}
            }
        },
        computed: {
            // clip_info: function () {
            //     if (this.data.hasOwnProperty('clip_info'))
            //         return this.data.clip_info;
            //     else return {}
            // },
            // full_comments: function () {
            //     if (this.data.hasOwnProperty('full_comments')) {
            //         return this.data.full_comments
            //     } else return [];
            // },
        },
        mounted() {
            window.addEventListener('scroll', this.scrollFunc);
            this.$http
                .get('https://api.neeemooo.com/viewer/' + this.id)
                .then(function (response) {
                    if (response.data.status === 0) {
                        this.data = response.data.data;
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