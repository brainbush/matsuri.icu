<template>
    <div id="app">
        <nav class="navbar navbar-dark bg-dark sticky-top">
            <div class="top_link">
                <router-link :to="{name:'home'}" class="navbar-brand">🍊</router-link>
            </div>
        </nav>
        <div class="container pt-3">
            <router-view/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        components: {}
    }
</script>

<style lang="scss">
    @import "node_modules/bootstrap/scss/bootstrap";
    .top_link{
        padding-left: 20px;
    }
</style>
