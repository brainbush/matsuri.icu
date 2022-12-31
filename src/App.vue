<template>
    <div id="app">
        <nav class="navbar navbar-dark bg-dark">
            <div class="container" style="">
                <div class="navbar-brand">
                    <router-link :to="{name:'home'}" class="navbar-brand">🍊</router-link>
                </div>
                <div class="navbar-nav">
                    <div class="nav-item text-white">
                        <router-link class="nav-link" :to="{name:'about'}">？</router-link>
                    </div>
                </div>
            </div>
        </nav>
        <div class="d-flex justify-content-center align-items-center" v-if="loading"
             style="position: fixed; width: 100%;height: 100%;z-index: 2;background-color: rgba(255,255,255,0.5)">
            <div class="spinner-border" role="status">
                <span class="sr-only"/>
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
.container, .canvas {
  max-width: 1140px !important;
}

hr {
  border-top: 1px solid rgba(0, 0, 0, .1) !important;
}

@import "node_modules/bootstrap/scss/bootstrap";
</style>
