<template>
    <div>
        <div v-if="!recaptcha_succeed">
            <div id="recaptcha"/>
        </div>
        <div v-if="recaptcha_succeed">
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
            recaptcha_succeed: false,
            recaptcha_sitekey: '6LdfylIbAAAAAN-SejK19mLMPkEtfrMVohDPa6oe',
            recaptcha_token: "",
            webp_support: this.$root.webp_support
        }
    },
    mounted() {
        document.title = 'ICU for Viewers'
        setTimeout(() => {
            window.grecaptcha.render("recaptcha", {sitekey: this.recaptcha_sitekey, callback: this.challenge_callback})
        }, 200);
    },
    methods: {
        challenge_callback(token) {
            this.recaptcha_token = token;
            this.recaptcha_succeed = true;
            window.addEventListener('scroll', this.scrollFunc);
            this.load_more();
        },
        scrollFunc() {
            if (document.body.clientHeight - window.scrollY - window.innerHeight < (document.body.clientHeight / this.showed)) {
                if (!this.is_end && !this.$root.loading) {
                    window.removeEventListener('scroll', this.scrollFunc);
                    this.load_more();
                    this.showed += 10;
                    window.addEventListener('scroll', this.scrollFunc);
                }
            }
        },
        load_more() {
            this.$root.loading = true;
            this.$http
            .get(`https://api.matsuri.icu/viewer/${this.id}?page=${++this.page}`, {headers: {token: this.recaptcha_token}})
            .then(function (response) {
                if (response.data.status === 0) {
                    this.data = this.data.concat(response.data.data);
                    if (response.data.data.length === 0)
                        this.is_end = true;
                    if (response.data.data.length > 0 && document.title === 'ICU for Viewers') document.title = this.data[0].full_comments[0].username + ' - ICU for Viewers';
                    this.$root.loading = false;
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