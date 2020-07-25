<template>
    <div id="app">
        <nav class="navbar navbar-dark bg-dark sticky-top">
            <div class="top_link" style="padding-left: 20px">
                <router-link :to="{name:'home'}" class="navbar-brand">🍊</router-link>
            </div>
            <div class="navbar-nav" style="padding-right: 20px">
                <div class="nav-item text-white">
                    <router-link class="nav-link" :to="{name:'about'}">？</router-link>
                </div>
            </div>
        </nav>
        <div class="d-flex justify-content-center align-items-center" v-if="loading"
             style="position: fixed; width: 100%;height: 100%;z-index: 2;background-color: rgba(255,255,255,0.5)">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div class="container pt-3">
            <router-view/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        components: {},
        data() {
            return {
                loading: false,
                webp_support: false
            }
        },
        created: function () {
            try {
                this.webp_support = (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
            } catch (e) {
                console.log('')
            }
        },
        watch: {
            loading: function (val) {
                if (val === false) {
                    window.dataLayer.push({event: 'custom.historyChange'})
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "node_modules/bootstrap/scss/bootstrap";
</style>
