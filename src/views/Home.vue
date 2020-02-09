<template>
    <div>
        <h1>别骂了，对不起，ごめんなさい~</h1>
        <div class="row">
            <div class="col-12">
                <hr>
            </div>
        </div>
        <div class="form-group">
            <label for="search_input"> </label>
            <input type="text" v-model="search_query" class="form-control col-12" id="search_input" placeholder="搜索">
        </div>
        <CardList v-for="channel in query_result" :channel="channel" :key="channel.bilibili_uid"/>
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
        return 0;
    }

    export default {
        name: "Home",
        components: {CardList},
        data() {
            return {
                channel_list: JSON.parse(localStorage.getItem('channel_list')),
                search_query: null
            }
        },
        computed: {
            query_result: function () {
                if (this.search_query === null)
                    return this.channel_list;
                let query_lowercase = this.search_query.toLowerCase();
                return this.channel_list.filter((item) => {
                    return item.name.toLowerCase().match(query_lowercase)
                })
            }
        },
        mounted() {
            this.$http
                .get('https://api.neeemooo.com/channel')
                .then(function (response) {
                    if (response.data.status === 0) {
                        this.channel_list = response.data.data.sort(true_compare);
                        localStorage.setItem('channel_list', JSON.stringify(response.data.data))
                    }
                }.bind(this))
                .catch(error => {
                    console.log(error)
                })
        }
    }
</script>

<style scoped>
    .empty {
        padding-bottom: 30px;
    }
</style>