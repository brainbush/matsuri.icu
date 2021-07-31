<template>
    <div>
        <ClipList :clip="clip_info" v-if="Object.entries(clip_info).length" :webp_support="webp_support"
                  :detail_view="true" :viewer_view="false"/>
        <div class="row">
            <div class="col">
                <v-chart class="chart" :option="chart_data" @datazoom="data_zoom" autoresize/>
            </div>
        </div>
        <div class="col-12">
            <hr>
        </div>
        <div class="container comment-container" v-if="show_comments">
            <div class="d-flex flex-wrap">
                <h3 class="me-auto">全部弹幕</h3>
                <div class="dropdown">
                    <button type="button" id="export_dropdown" class="btn btn-success me-2 dropdown-toggle"
                            aria-haspopup="true" data-bs-toggle="dropdown"
                            aria-expanded="false">导出全部弹幕
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" @click="download_danmu_json(0)">JSON</a></li>
                        <li><a class="dropdown-item" @click="download_danmu_xml(0)">XML</a></li>
                        <li><a class="dropdown-item" @click="download_danmu_json(1)">JSON（翻译man）</a></li>
                        <li><a class="dropdown-item" @click="download_danmu_xml(1)">XML（翻译man）</a></li>
                    </ul>
                </div>
                <div class="btn-group mid me-2">
                    <button type="button" v-on:click="list_status(0)" id="state0"
                            class="btn btn-outline-primary active">全部
                    </button>
                    <button type="button" v-on:click="list_status(1)" id="state1" class="btn btn-outline-primary">
                        翻译man
                    </button>
                    <button type="button" v-on:click="list_status(2)" id="state2" class="btn btn-outline-primary">
                        礼物
                    </button>
                </div>
            </div>
            <div class="row pt-2 align-items-center" v-if="state===0">
                <div class="col-auto">
                    <label for="search_input">标记词👀：</label>
                </div>
                <div class="col-auto">
                    <input type="text" id="search_input" v-model="search_text" class="form-control">
                </div>
            </div>
            <div class="row pt-2 align-items-center" v-if="state===1">
                <div class="col-auto">
                    <label for="regex_input">筛选正则：</label>
                </div>
                <div class="col-auto">
                    <input type="text" id="regex_input" v-model="filter_regex" class="form-control"/>
                </div>
                <div class="col-auto">
                    <button class="btn btn-primary" v-on:click="get_translate_comments()">应用</button>
                </div>
            </div>
            <div class="row pt-2 align-items-center" v-if="state===2">
                <div class="col">
                    <div class="form-group">
                        <input type="checkbox" id="gift_filter_checkbox" v-model="filter_checkbox">
                        <label for="gift_filter_checkbox">隐藏小于
                            <input type="number" style="max-width: 80px;display: inline" class="form-control pl-2 pr-2"
                                   step="0.1" v-model="filter_price">元的礼物
                        </label>
                    </div>
                </div>
            </div>
            <LiveComment v-for="comment in comments_showed" :comment="comment" :key="comment.i" :viewer_view="false"/>
        </div>
        <div class="container text-center" v-else>
            <button class="btn btn-primary" v-on:click="get_comments">显示所有弹幕</button>
        </div>
    </div>
</template>

<script>
import ClipList from "@/components/ClipList";
import LiveComment from "@/components/LiveComment";
import "bootstrap";
import VChart from "vue-echarts";
import {use} from "echarts/core";
import {LineChart} from "echarts/charts";
import {CanvasRenderer} from "echarts/renderers"
import {LegendComponent, DataZoomComponent, TooltipComponent, GridComponent, DatasetComponent} from "echarts/components"

use([CanvasRenderer, LegendComponent, DataZoomComponent, TooltipComponent, GridComponent, LineChart, DatasetComponent]);

export default {
    name: "Detail",
    components: {ClipList, LiveComment, 'v-chart': VChart},

    data() {
        return {
            id: this.$route.params.id,
            data: {},
            showed: 500,
            state: 0,
            full_comments: [],
            translated_comments: [],
            show_comments: false,
            webp_support: this.$parent.webp_support,
            filter_checkbox: false,
            filter_price: 0.1,
            crc_table: null,
            search_text: '',
            filter_regex: '^(?<n>[^【】()]+?)?:*\\s*[【(](?<cc>[^【】()]+?)[】)]*$',
            time_range: {}
        }
    },
    computed: {
        chart_data: function () {
            let columns = [];
            let series = [];
            let legend_data;
            let legend_selected = {};
            if (this.data.hasOwnProperty('highlights')) {
                if (!Array.isArray(this.data.highlights)) return {}
                columns = Object.keys(this.data.highlights[0]);
                for (let i = 0; i < columns.length; i++) {
                    if (columns[i] === 'time') continue;
                    series.push({
                        type: "line",
                        encode: {x: "time", y: columns[i]},
                        name: columns[i],
                        smooth: true,
                        showSymbol: false
                    })
                }
                legend_data = columns.slice();
                legend_data.splice(legend_data.indexOf('time'), 1);
                for (let i = 0; i < legend_data.length; i++) {
                    legend_selected[legend_data[i]] = i < 5;
                }
                return {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {animation: false},
                        backgroundColor: 'rgba(50, 50, 50, 0.7)',
                        borderColor: 'rgba(50,50,50,0.7)',
                        textStyle: {color: '#fff', height: '5px'}
                    },
                    dataZoom: [
                        {
                            id: 'time',
                            type: 'slider'
                        }
                    ],
                    legend: {data: legend_data, selected: legend_selected},
                    xAxis: {type: "time"},
                    yAxis: {type: "value"},
                    dataset: {
                        dimensions: columns,
                        source: this.data.highlights
                    },
                    series: series
                }
            } else return {}
        },
        clip_info: function () {
            if (this.data.hasOwnProperty('start_time')) {
                let info = Object.assign({}, this.data)
                delete info.highlights
                return info;
            } else return {}
        },
        comments_showed_full: function () {
            let full_comments;
            if (!this.time_range.hasOwnProperty('start')) full_comments = this.full_comments;
            else full_comments = this.full_comments.filter(comment => comment.time >= this.time_range.start && comment.time <= this.time_range.end)
            if (this.state === 0) {
                if (this.search_text.length === 0) return full_comments;
                return full_comments.filter(comment => comment.text !== undefined && comment.text.includes(this.search_text))
            } else if (this.state === 1) {
                if (this.translated_comments.length === 0) this.get_translate_comments();
                return this.translated_comments;
            } else {
                if (this.filter_checkbox) {
                    let comments_with_price = this.full_comments.filter(comment => comment.hasOwnProperty('gift_name') || comment.hasOwnProperty('superchat_price'));
                    return comments_with_price.filter(comment => comment.gift_price > this.filter_price || comment.superchat_price > this.filter_price)
                } else {
                    return this.full_comments.filter(comment => comment.hasOwnProperty('gift_name') || comment.hasOwnProperty('superchat_price'));
                }
            }
        },
        comments_showed: function () {
            return this.comments_showed_full.filter((comment, index) => index < this.showed)
        }
    },
    mounted() {
        document.title = 'ICU for Viewers';
        this.$parent.loading = true;
        window.addEventListener('scroll', this.scrollFunc);
        this.$http
        .get('https://api.matsuri.icu/clip/' + this.id)
        .then(function (response) {
            if (response.data.status === 0) {
                this.data = response.data.data;
                document.title = this.data.title + ' - ' + this.data.name + ' - ICU for Viewers'
                this.$parent.loading = false;
            }
        }.bind(this))
    },
    methods: {
        data_zoom(params) {
            let percent = (this.clip_info.end_time - this.clip_info.start_time) / 100
            this.time_range = {
                start: this.clip_info.start_time + params.start * percent,
                end: this.clip_info.start_time + params.end * percent
            }
        },
        scrollFunc() {
            if (document.body.clientHeight - window.scrollY - window.innerHeight < (document.body.clientHeight / this.showed)) {
                if (this.showed < this.comments_showed_full.length)
                    this.showed += 500;
            }
        },
        list_status: function (state) {
            if (state === this.state)
                return;
            document.getElementById('state' + this.state.toString()).classList.remove('active');
            document.getElementById('state' + state.toString()).classList.add('active');
            this.state = state;
            this.showed = 500;
        },
        get_comments: function () {
            this.show_comments = true;
            this.$parent.loading = true;
            this.$http
            .get('https://api.matsuri.icu/clip/' + this.id + '/comments')
            .then(function (response) {
                if (response.data.status === 0) {
                    let full_comments = [];
                    response.data.data.forEach(function (comment, i) {
                        comment.i = i;
                        full_comments.push(comment)
                    });
                    this.full_comments = full_comments;
                    this.$parent.loading = false;
                }
            }.bind(this))
        },
        download_danmu_json: function (status) {
            let full_comments
            if (status) {
                if (this.translated_comments.length === 0) this.get_translate_comments()
                full_comments = this.translated_comments
            } else full_comments = this.full_comments;
            let blob = new Blob([JSON.stringify({
                info: this.clip_info,
                full_comments: full_comments
            })], {type: 'application/json'});
            let blob_url = window.URL.createObjectURL(blob);
            let file_name = this.clip_info.name + '_' + this.clip_info.title + '_' + this.clip_info.start_time + '.json'
            let blob_link = document.createElement('a');
            blob_link.href = blob_url;
            blob_link.download = file_name;
            blob_link.click();
            window.URL.revokeObjectURL(blob_url);
        },
        download_danmu_xml: function (status) {
            let full_comments
            if (status) {
                if (this.translated_comments.length === 0) this.get_translate_comments()
                full_comments = this.translated_comments
            } else full_comments = this.full_comments;

            let doc = document.implementation.createDocument("", "", null);
            let i_element = doc.createElement('i');
            full_comments.forEach(comment => {
                if (comment.hasOwnProperty('text')) {
                    let d_element = doc.createElement('d')
                    let time_d = (comment.time - this.clip_info.start_time) / 1000;
                    d_element.setAttribute('p', `${time_d},1,25,16777215,${Math.floor(comment.time / 1000)},0,${this.get_crc32(comment.user_id.toString()).toString(16)},${comment.i}`)
                    d_element.textContent = comment.text
                    i_element.appendChild(d_element)
                }
            })
            doc.appendChild(i_element)
            let oSerializer = new XMLSerializer();
            let sXML = '<?xml version="1.0" encoding="UTF-8"?>' + oSerializer.serializeToString(doc);
            let blob = new Blob([sXML], {type: 'text/xml'});
            let blob_url = window.URL.createObjectURL(blob);
            let file_name = this.clip_info.name + '_' + this.clip_info.title + '_' + this.clip_info.start_time + '.xml'
            let blob_link = document.createElement('a');
            blob_link.href = blob_url;
            blob_link.download = file_name;
            blob_link.click();
            window.URL.revokeObjectURL(blob_url);
        },
        generate_crc_table: function () {
            let c;
            let crcTable = [];
            for (let n = 0; n < 256; n++) {
                c = n;
                for (let k = 0; k < 8; k++) {
                    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                }
                crcTable[n] = c;
            }
            return crcTable;
        },
        get_crc32: function (uid) {
            let crcTable = this.crcTable || (this.crcTable = this.generate_crc_table());
            let crc = 0 ^ (-1);
            for (let i = 0; i < uid.length; i++) {
                crc = (crc >>> 8) ^ crcTable[(crc ^ uid.charCodeAt(i)) & 0xFF];
            }
            return (crc ^ (-1)) >>> 0;
        },
        translate_filter: comment => {
            let emoji_list = ["(⌒▽⌒)", "（￣▽￣）", "(=・ω・=)", "(｀・ω・´)", "(〜￣△￣)〜", "(･∀･)", "(°∀°)ﾉ", "(￣3￣)", "╮(￣▽￣)╭", "_(:3」∠)_", "( ´_ゝ｀)", "←_←", "→_→", "(<_<)", "(>_>)", "(;¬_¬)", '("▔□▔)/', "(ﾟДﾟ≡ﾟдﾟ)!?", "Σ(ﾟдﾟ;)", "Σ( ￣□￣||)", "(´；ω；`)", "（/TДT)/", "(^・ω・^ )", "(｡･ω･｡)", "(●￣(ｴ)￣●)", "ε=ε=(ノ≧∇≦)ノ", "(´･_･`)", "(-_-#)", "（￣へ￣）", "(￣ε(#￣) Σ", "ヽ(`Д´)ﾉ", "（#-_-)┯━┯", "(╯°口°)╯(┴—┴", "←◡←", "( ♥️д♥️)", "Σ>―(〃°ω°〃)♡→", "⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄", "(╬ﾟдﾟ)▄︻┻┳═一", "･*･:≡( ε:)", "(汗)", "(苦笑)"];
            if (comment.hasOwnProperty('text'))
                return (comment.text.includes('【') | comment.text.includes('（')) & emoji_list.indexOf(comment.text) === -1;
            return false;
        },
        get_translate_comments: function () {
            let full_comments;
            if (!this.time_range.hasOwnProperty('start')) full_comments = this.full_comments;
            else full_comments = this.full_comments.filter(comment => comment.time >= this.time_range.start && comment.time <= this.time_range.end)
            this.translated_comments = [];
            let re = new RegExp(this.filter_regex)
            let comments = full_comments.filter(this.translate_filter)
            comments.forEach(comment => {
                let c = Object.assign({}, comment)
                let t = re.exec(c.text)
                if (t) {
                    if (t[1]) c.text = `${t[1]}:${t[2]}`
                    else c.text = `${t[2]}`
                    this.translated_comments.push(c)
                }
            })
        }
    }
}
</script>

<style scoped>
.comment-container {
    padding: 5px 15px;
}

.mid {
    margin-top: auto;
    margin-bottom: auto;
}

.chart {
    height: 400px;
}
</style>