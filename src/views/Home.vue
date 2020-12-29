<template>
    <div>
        <h1>{{head_text}}</h1>
        <div class="form-group">
            <label for="search_input"> </label>
            <input type="text" v-model="search_query" class="form-control col-12" id="search_input" placeholder="搜索">
        </div>
        <CardList v-for="channel in display_result" :channel="channel" :webp_support="webp_support"
                  :key="channel.bilibili_uid"/>
        <div class="empty"></div>
    </div>
</template>

<script>
import CardList from "@/components/CardChannelList";

function true_compare(a, b) {
    if (a.is_live && !b.is_live)
        return -1;
    if (!a.is_live && b.is_live)
        return 1;
    if (!(a.is_live ^ b.is_live))
        return b.last_live - a.last_live;
    return 0;
}

export default {
    name: "Home",
    components: {CardList},
    data() {
        return {
            channel_data: JSON.parse(localStorage.getItem('channel_list')).sort(true_compare),
            channel_list: [],
            search_query: null,
            showed: 30,
            show_hidden: this.$route.query.hasOwnProperty('hey'),
            webp_support: this.$parent.webp_support,
            head_list: ['别骂了，对不起，ごめんなさい~', '鸟鸟鸟鸟鸟鸟鸟鸟鸟鸟', '憨憨憨憨憨憨憨憨憨憨', '本社爆破~！', '内鬼全鲨了！']
        }
    },
    computed: {
        head_text: function () {
            return this.head_list[Math.floor(Math.random() * this.head_list.length)]
        },
        query_result: function () {
            if (this.channel_list === null) {
                return [];
            }
            if (this.search_query === null || this.search_query === '')
                return this.channel_list;
            let query_lowercase = this.search_query.toLowerCase();
            return this.channel_list.filter((item) => {
                return item.name.toLowerCase().match(query_lowercase)
            })
        },
        display_result: function () {
            return this.query_result.filter((channel, index) => index < this.showed)
        }
    },
    watch: {
        search_query: function () {
            this.showed = 30
        },
        channel_data: function (val) {
            if (this.show_hidden) this.channel_list = val.slice().sort(true_compare);
            else this.channel_list = val.filter(channel => channel.hidden === false).slice().sort(true_compare);
        }
    },
    mounted() {
        document.title = 'ICU for Viewers';
        window.addEventListener('scroll', this.scrollFunc);
        if (this.channel_list === null)
            this.$parent.loading = true;
        this.$http
        .get('https://api.neeemooo.com/channel')
        .then(function (response) {
            if (response.data.status === 0) {
                this.channel_data = response.data.data;
                localStorage.setItem('channel_list', JSON.stringify(response.data.data));
                this.$parent.loading = false;
            }
        }.bind(this))
        .catch(error => {
            console.log(error)
        })
    },
    methods: {
        scrollFunc() {
            if (document.body.clientHeight - window.scrollY - window.innerHeight < (document.body.clientHeight / this.showed)) {
                if (this.showed < this.query_result.length)
                    this.showed += 30;
            }
        }
    }
}
</script>

<style scoped>
.empty {
    padding-bottom: 30px;
}
</style>