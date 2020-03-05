<template>
    <div>
        <div class="container">
            <div class="row comment mid">
                {{time}}
                <div v-if="this.viewer_view">
                    <a target="_blank" rel="noopener noreferrer" class="username"
                       :href="'https://space.bilibili.com/'+user_id">{{username}}</a>：
                </div>
                <div v-else>
                    <router-link :to="{name:'viewer',params:{id:user_id}}" class="username">{{username}}</router-link>
                </div>
                <div v-if="text">
                    <span style="padding-left: 15px">{{text}}</span>
                    <span v-if="this.superchat_price" style="padding-left: 15px;color: brown">SuperChat: ￥{{superchat_price}}</span>
                </div>
                <div v-else>
                    <div style="color:red;padding-left: 15px">礼物：{{gift_name}}，￥{{gift_price}}×{{gift_num}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LiveComment",
        props: {
            comment: Object,
            viewer_view: Boolean
        },
        data() {
            return {
                time: this.$moment(this.comment.time).format('HH:mm:ss.SSS'),
                text: this.comment.text,
                user_id: this.comment.user_id,
                username: this.comment.username,
                gift_name: this.comment.gift_name,
                gift_price: this.comment.gift_price,
                gift_num: this.comment.gift_num,
                superchat_price: this.comment.superchat_price
            }
        }
    }
</script>
<style scoped>
    .comment {
        padding: 2px 15px;
    }

    .username {
        padding-left: 15px;
    }
</style>