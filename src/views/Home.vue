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
        <footer class="footer mt-auto py-1">
                <a hrer="https://beian.miit.gov.cn/"><span>鄂ICP备2021002054号</span></a>
        </footer>
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
    name: "HomePage",
    components: {CardList},
    data() {
        return {
            channel_data: JSON.parse(localStorage.getItem('channel_list') || "[]").sort(true_compare),
            channel_list: [],
            search_query: null,
            showed: 30,
            show_hidden: this.$route.query.hasOwnProperty('hey'),
            webp_support: this.$root.webp_support,
            head_list: ['别骂了，对不起，ごめんなさい~', '本社爆破~！', '内鬼全鲨了！', '嘉门🙏', 'まつり指的可是麻酱啊', '你们到底是看管人还是看管人观众啊', '你们是在和SC聊天还是在和然然聊天', '海子姐在看吗，在看的话就mua一个']
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
                return Number(query_lowercase) === item.bilibili_uid || Number(query_lowercase) === item.bilibili_live_room || item.name.toLowerCase().match(query_lowercase)
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
            this.$root.loading = true;
        this.$http
        .get('https://api.matsuri.icu/channel')
        .then(function (response) {
            if (response.data.status === 0) {
                this.channel_data = response.data.data;
                localStorage.setItem('channel_list', JSON.stringify(response.data.data));
                this.$root.loading = false;
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

footer {
    background: rgba(255,255,255,0.5);
    bottom: 0;
    font-size: 0.6rem;
    position: fixed;
}
</style>
