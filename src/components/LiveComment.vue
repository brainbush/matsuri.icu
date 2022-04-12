<template>
    <div>
        <div class="d-flex comment mid">
            {{time}}
            <a target="_blank" rel="noopener noreferrer" class="username"
               :href="'https://space.bilibili.com/'+user_id">{{username}}</a>
            <div v-if="text">
                <span style="padding-left: 15px">{{text}}</span>
                <span v-if="this.superchat_price"
                      style="padding-left: 15px;color: brown">SuperChat: ￥{{superchat_price}}</span>
            </div>
            <div v-else>
                <div style="color:red;padding-left: 15px">礼物：{{gift_name}}×{{gift_num}}，￥{{gift_price}}</div>
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
    computed: {
        time: function () {
            return this.$moment(this.comment.time).format('HH:mm:ss.SSS')
        },
        text: function () {
            if (this.comment)
                return this.comment.text;
            else return null;
        },
        user_id: function () {
            if (this.comment)
                return this.comment.user_id;
            else return ''
        },
        username: function () {
            if (this.comment)
                return this.comment.username;
            else return ''
        },
        gift_name: function () {
            if (this.comment)
                return this.comment.gift_name;
            else return ''
        },
        gift_price: function () {
            if (this.comment)
                return this.comment.gift_price;
            else return null;
        },
        gift_num: function () {
            if (this.comment)
                return this.comment.gift_num;
            else return ''
        },
        superchat_price: function () {
            if (this.comment)
                return this.comment.superchat_price;
            else return ''
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
